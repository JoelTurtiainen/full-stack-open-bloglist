const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')

const helper = require('../tests/test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

let TOKEN;

beforeEach(async () => {
  await Blog.deleteMany({})

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  TOKEN = (await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect('Content-Type', /application\/json/)).body.token

  const initialBlogs = helper.initialBlogs.map(blog => ({ ...blog, user }))
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 6)
})

test('returned blogs contain id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body.find(blog => !blog.id);
  assert(blog == undefined)
})

test('setting default likes on missing blog', async () => {
  const users = await helper.usersInDb()
  const user = users[0]

  const blogWithNolikes = {
    title: 'Pineapple Pizza',
    author: 'Pizzaman456',
    url: 'pizzaman456reviews.com',
    userId: user.id
  }

  const response = await api
    .post('/api/blogs')
    .set({ 'Authorization': 'Bearer ' + TOKEN })
    .send(blogWithNolikes)
    .expect(201)

  assert(Number.isInteger(response.body.likes))
})

test('rejecting blog with no title & url', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const invalidBlog = {
    author: 'Pizzaman456',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(invalidBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('deleting a blog works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set({ 'Authorization': 'Bearer ' + TOKEN })
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('updating blog works', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)

  const blogsAtEnd = await helper.blogsInDb()

  assert.notDeepStrictEqual(blogsAtEnd[0], blogsAtStart[0])
})

describe('when there is initially one user at db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'kari',
      name: 'karikiuas',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  describe('creation fails with proper statuscode and message if:', () => {

    test('username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('username is missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert(result.body.error.includes('Path `username` is required'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('username is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mi',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()

      assert(result.body.error.includes(`Path \`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length`))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('password is too short or missing', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mies',
        name: 'mies',
        password: '12',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const usersAtEnd = await helper.usersInDb()

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})
