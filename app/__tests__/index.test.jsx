import { render, screen } from '@testing-library/react'
import Index from '../pages/index'
import '@testing-library/jest-dom'

describe('Index', () => {
  it('renders 3 buttons', () => {
    render(<Index />)

    const buttons = screen.getAllByRole('button', {
      name: /clicca qui/i,
    })
    
    expect(buttons).toHaveLength(3)
  })
})