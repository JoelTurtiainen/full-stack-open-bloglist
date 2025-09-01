const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const { initialBlogs } = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const blogs = initialBlogs
  const listWithOneBlog = [blogs[0]];

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 7)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 36)
  })

  test('blog with most likes is calculated right', () => {
    const favorite = listHelper.favoriteBlog(blogs)
    assert.strictEqual(favorite.likes, 12)
  })

  test('author with most blogs is correct', () => {
    const author = listHelper.mostBlogs(blogs)
    assert.strictEqual(author.blogs, 3)
  })

  test('blogger with most likes is correct', () => {
    const author = listHelper.mostLikes(blogs)
    assert.strictEqual(author.likes, 17)
  })
})
