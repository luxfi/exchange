import { LearnMoreLink } from '@l.x/lx/src/components/text/LearnMoreLink'
import { renderWithProviders } from '@l.x/lx/src/test/render'

vi.mock('@l.x/lx/src/utils/linking', () => ({
  openUri: vi.fn(),
}))

describe(LearnMoreLink, () => {
  it('renders without error', () => {
    const tree = renderWithProviders(<LearnMoreLink url="https://example.com" />)

    expect(tree).toMatchSnapshot()
  })

  it('renders a learn more link', () => {
    const { queryByText } = renderWithProviders(<LearnMoreLink url="https://example.com" />)

    const learnMoreLink = queryByText('Learn more')

    expect(learnMoreLink).toBeTruthy()
  })
})
