import { SearchBar } from '~/components/NavBar/SearchBar'
import mockMediaSize from '~/test-utils/mockMediaSize'
import { render, screen } from '~/test-utils/render'

vi.mock('@hanzo/gui', async () => {
  const actual = await vi.importActual('@hanzo/gui')
  return {
    ...actual,
    useMedia: vi.fn(),
  }
})

vi.mock('@l.x/lx/src/components/modals/ScrollLock', () => ({
  useUpdateScrollLock: vi.fn(),
}))

describe('disable nft on searchbar', () => {
  beforeEach(() => {
    mockMediaSize('xxxl')
  })

  it('should render searchbar on larger screen', () => {
    const { container } = render(<SearchBar />)
    expect(container).toMatchSnapshot()
    const input = screen.getByTestId('nav-search-input')
    expect(input).toBeInTheDocument()
  })
})
