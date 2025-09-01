const dummy = (blogs) => {
  return 1
}

const largestInArrayOfObjects = (array, key, initial = 0) => {
  return array.reduce((previous, current) => {
    return current[key] > previous[key]
      ? current
      : previous
  }, { [key]: initial })
}

const totalLikes = (array) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0)
}

const favoriteBlog = (array) => {
  return largestInArrayOfObjects(array, "likes")
}

const mostBlogs = (array) => {
  const blogs = array.reduce((previous, current) => {
    const found = previous.find(o => o.author === current.author)
    const filtered = previous.filter(o => o.author !== current.author)

    return found
      ? [...filtered, { ...found, blogs: found.blogs + 1 }]
      : [...previous, { author: current.author, blogs: 1 }]
  }, [])

  return largestInArrayOfObjects(blogs, "blogs")
}

const mostLikes = (array) => {
  const blogs = array.reduce((previous, current) => {
    const found = previous.find(o => o.author === current.author)
    const filtered = previous.filter(o => o.author !== current.author)

    return found
      ? [...filtered, { ...found, likes: found.likes + current.likes }]
      : [...previous, { author: current.author, likes: current.likes }]
  }, [])

  return largestInArrayOfObjects(blogs, "likes")
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
