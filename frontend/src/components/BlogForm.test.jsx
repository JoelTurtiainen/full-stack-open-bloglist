import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, beforeEach, describe } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let createBlog, blog, container

  beforeEach(() => {
    createBlog = vi.fn()
    container = render(<BlogForm createBlog={createBlog} />).container
  })

  test('calling callback function with correct form values', async () => {
    const user = userEvent.setup()
    const sendButton = screen.getByText('create')

    const title = screen.getByRole('textbox', { name: 'blogTitle' })
    const author = screen.getByRole('textbox', { name: 'blogAuthor' })
    const url = screen.getByRole('textbox', { name: 'blogUrl' })

    await user.type(title, 'Test Blog Title')
    await user.type(author, 'TestDude32')
    await user.type(url, 'google.com')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test Blog Title')
  })
})
