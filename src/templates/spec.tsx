import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { COMPONENT_NAME_ } from './COMPONENT_NAME_.component'

describe('<COMPONENT_NAME_ />', () => {
  it('renders', () => {
    // 1) Arrange
    // 2) Act
    // 3) Assert

    render(<COMPONENT_NAME_ />)

    expect(screen.findByText('Foo')).toBeTruthy()
  })
})
