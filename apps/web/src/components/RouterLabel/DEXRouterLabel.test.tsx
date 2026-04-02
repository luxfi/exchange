import { v4 as uuid } from 'uuid'
import DEXRouterLabel from '~/components/RouterLabel/DEXRouterLabel'
import { mocked } from '~/test-utils/mocked'
import { render, screen } from '~/test-utils/render'

vi.mock('uuid')

describe('DEXRouterLabel', () => {
  it('matches snapshot', () => {
    mocked(uuid).mockReturnValue('test-id')
    const { asFragment } = render(<DEXRouterLabel>test router label</DEXRouterLabel>)
    expect(screen.getByText('test router label')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
