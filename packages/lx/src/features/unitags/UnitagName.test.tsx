import { UnitagName } from 'lx/src/features/unitags/UnitagName'
import { renderWithProviders } from 'lx/src/test/render'

it('renders UnitagName without a name', () => {
  const tree = renderWithProviders(<UnitagName animateText textProps={{ fontSize: 12 }} />)
  expect(tree).toMatchSnapshot()
})

it('renders UnitagName with a name', () => {
  const tree = renderWithProviders(<UnitagName animateText animateIcon textProps={{ fontSize: 12 }} name="testing" />)
  expect(tree).toMatchSnapshot()
})
