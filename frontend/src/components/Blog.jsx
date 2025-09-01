import PropTypes from 'prop-types'
import { useState } from 'react'
import styles from '../style.module.css'

const Blog = ({ blog, updateBlog, removeBlog, isOwner }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const buttonText = visible ? 'hide' : 'show'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = () => {
    updateBlog({ ...blog, likes: blog.likes + 1 })
  }

  return (
    <div className={styles.blog}>
      <ul className={styles.title}>
        <li>{blog.title}</li>
        <li>{blog.author}</li>
        <li><button onClick={toggleVisibility}>{buttonText}</button></li>
      </ul>
      <ul style={showWhenVisible} >
        <li><a href={blog.url}>{blog.url}</a></li>
        <li>likes {blog.likes} <button onClick={addLike}>like</button></li>
        <li>{blog.user.name}</li>
        {isOwner ? <li><button onClick={() => removeBlog(blog)} className={styles.btnRemove}>remove</button></li> : ''}
      </ul>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func,
  removeBlog: PropTypes.func,
  isOwner: PropTypes.bool
}

export default Blog
