import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [message, setMessage] = useState({ text: null })
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || null))


  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user) // Save user to localstorage
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ text: 'wrong username or password', error: true })
    }

    setTimeout(() => {
      setMessage({ text: null })
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject, user)
      setBlogs(blogs.concat({ ...returnedBlog, user }))
      blogFormRef.current.toggleVisibility()
      setMessage({ text: `a new Blog ${returnedBlog.title} by ${returnedBlog.author} added` })

    } catch ({ status }) {
      if (status === 401) {
        setMessage({ text: 'Token Expired', error: true })
      } else if (status === 400) {
        setMessage({ text: 'Invalid blog body', error: true })
      } else {
        setMessage({ text: 'Uh oh', error: true })
      }
    }

    setTimeout(() => {
      setMessage({ text: null })
    }, 5000)
  }

  const updateBlog = async (blogObject) => {
    // Only used for updating likes at the moment
    try {
      const response = await blogService.update(blogObject, user)
      console.log(response.id)
      setBlogs(blogs.map((blog) => blog.id !== response.id ? blog : { ...response, user }))
      console.log(blogs)
    } catch (exception) {
      console.log(exception)
    }
  }

  const removeBlog = async (blogObject) => {
    if (!confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) return

    try {
      await blogService.remove(blogObject.id, user)
      setBlogs(blogs.filter(blog => blog !== blogObject))
      setMessage({ text: `Removed blog ${blogObject.title} by ${blogObject.author}` })
    } catch ({ status }) {
      if (status === 401 && user.username === blogObject.user.username) {
        setMessage({ text: 'Token Expired', error: true })
      } else if (status === 401) {
        setMessage({ text: 'Could not delete the blog, Are you the author?', error: true })
      } else {
        setMessage({ text: 'Uh oh', error: true })
      }
    }

    setTimeout(() => {
      setMessage({ text: null })
    }, 5000)
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        < Notification message={message} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              data-testid='username'
              type="text"
              value={username}
              aria-label="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              data-testid='password'
              type="password"
              value={password}
              aria-label="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      < Notification message={message} />
      <p>{user.name} logged in <button onClick={() => setUser(null)}>logout</button></p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) =>
          <Blog
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            isOwner={user.username === blog.user.username}
            key={blog.id}
            blog={blog}
          />
        )
      }
    </div>
  )
}

export default App
