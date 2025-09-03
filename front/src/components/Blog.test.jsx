import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  let mockHandler, blog, container

  beforeEach(() => {
    blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'bob',
      url: 'google.com',
      likes: 0,
      user: {
        name: 'kevin'
      }
    }

    mockHandler = vi.fn()
    container = render(<Blog blog={blog} updateBlog={mockHandler} />).container
  })

  test('renders: title', () => {
    const element = screen.getByText('Component testing is done with react-testing-library')
    expect(element).toBeDefined()
  })

  test('renders: url, likes and user when expanded', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const toggleable = container.querySelectorAll('ul')[1]

    const matchers = [blog.url, `likes ${blog.likes}`, blog.user.name]
    const elements = matchers.filter(matcher => screen.getByText(matcher))

    expect(toggleable).not.toHaveStyle('display: none')
    expect(elements).toHaveLength(3)
  })

  test('multiple likes use same eventListener', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')

    for (let index = 0; index < 2; index++) {
      await user.click(button)
    }

    expect(mockHandler.mock.calls).length(2)
  })
})
