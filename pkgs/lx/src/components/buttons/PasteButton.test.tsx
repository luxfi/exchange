import PasteButton from 'lx/src/components/buttons/PasteButton'
import { SplitLogo } from 'lx/src/components/CurrencyLogo/SplitLogo'
import { render } from 'lx/src/test/test-utils'

describe(SplitLogo, () => {
  it('renders without error', () => {
    const tree = render(<PasteButton onPress={(text) => text} />)

    expect(tree).toMatchSnapshot()
  })
  describe('inline', () => {
    it('renders inline button', () => {
      const tree = render(<PasteButton inline onPress={(text) => text} />)

      expect(tree).toMatchSnapshot()
    })
  })
})
