import { v4 as uuid } from 'uuid'
import LXRouterLabel from '~/components/RouterLabel/LXRouterLabel'
import { mocked } from '~/test-utils/mocked'
import { render, screen } from '~/test-utils/render'

vi.mock('uuid')

describe('LXRouterLabel', () => {
  it('matches snapshot', () => {
    mocked(uuid).mockReturnValue('test-id')
    const { asFragment } = render(<LXRouterLabel>test router label</LXRouterLabel>)
    expect(screen.getByText('test router label')).toBeInTheDocument()
    expect(asFragment()).toMatchSnapshot()
  })
})
