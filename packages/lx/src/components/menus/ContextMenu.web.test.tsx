import { fireEvent as rtlFireEvent } from '@testing-library/react'
import { act } from '@testing-library/react-native'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { View } from 'react-native'
import { Flex } from 'ui/src'
<<<<<<<< HEAD:packages/lx/src/components/menus/ContextMenuV2.web.test.tsx
import { MenuOptionItem } from 'lx/src/components/menus/ContextMenuV2'
import { ContextMenu } from 'lx/src/components/menus/ContextMenuV2.web'
import { ContextMenuTriggerMode } from 'lx/src/components/menus/types'
import { renderWithProviders } from 'lx/src/test/render'
========
import { MenuOptionItem } from 'uniswap/src/components/menus/ContextMenu'
import { ContextMenu } from 'uniswap/src/components/menus/ContextMenu.web'
import { ContextMenuTriggerMode } from 'uniswap/src/components/menus/types'
import { renderWithProviders } from 'uniswap/src/test/render'
>>>>>>>> upstream/main:packages/lx/src/components/menus/ContextMenu.web.test.tsx

describe('ContextMenu', () => {
  const mockMenuItems: MenuOptionItem[] = [
    {
      label: 'Option 1',
      onPress: vi.fn(),
    },
    {
      label: 'Option 2',
      onPress: vi.fn(),
      showDivider: true,
    },
  ]

  it('renders without error', () => {
    const tree = renderWithProviders(
      <ContextMenu
        menuItems={mockMenuItems}
        triggerMode={ContextMenuTriggerMode.Secondary}
        isOpen={true}
        closeMenu={vi.fn()}
        openMenu={vi.fn()}
      >
        <Flex>Trigger</Flex>
      </ContextMenu>,
    )

    expect(tree).toMatchSnapshot()
  })

  describe('opens the menu', () => {
    it('on right-click', () => {
      const { getByTestId, queryByText } = renderWithProviders(
        <ContextMenu
          menuItems={mockMenuItems}
          triggerMode={ContextMenuTriggerMode.Secondary}
          isOpen={true}
          closeMenu={vi.fn()}
        >
          {/* @ts-expect-error RN View type */}
          <View testID="trigger">
            <Flex>Trigger</Flex>
          </View>
        </ContextMenu>,
      )

      const trigger = getByTestId('trigger') as unknown as Element

      act(() => {
        rtlFireEvent.contextMenu(trigger, {
          clientX: 100,
          clientY: 150,
        })
      })

      expect(queryByText('Option 1')).toBeTruthy()
      expect(queryByText('Option 2')).toBeTruthy()
    })

    it('on left-click', () => {
      const { getByTestId, queryByText } = renderWithProviders(
        <ContextMenu
          menuItems={mockMenuItems}
          triggerMode={ContextMenuTriggerMode.Primary}
          isOpen={true}
          closeMenu={vi.fn()}
        >
          {/* @ts-expect-error RN View type */}
          <View testID="trigger">
            <Flex>Trigger</Flex>
          </View>
        </ContextMenu>,
      )

      const trigger = getByTestId('trigger') as unknown as Element

      act(() => {
        rtlFireEvent.mouseDown(trigger, {
          clientX: 100,
          clientY: 150,
        })
      })
      expect(queryByText('Option 1')).toBeTruthy()
      expect(queryByText('Option 2')).toBeTruthy()
    })
  })

  describe('handles edge cases', () => {
    it('does not open the menu if no menuItems are provided', () => {
      const { getByTestId, queryByRole } = renderWithProviders(
<<<<<<<< HEAD:packages/lx/src/components/menus/ContextMenuV2.web.test.tsx
        <ContextMenu menuItems={[]} triggerMode={ContextMenuTriggerMode.Secondary} isOpen={true} closeMenu={jest.fn()}>
          {/* @ts-expect-error RN View type */}
========
        <ContextMenu menuItems={[]} triggerMode={ContextMenuTriggerMode.Secondary} isOpen={true} closeMenu={vi.fn()}>
>>>>>>>> upstream/main:packages/lx/src/components/menus/ContextMenu.web.test.tsx
          <View testID="trigger">
            <Flex>Trigger</Flex>
          </View>
        </ContextMenu>,
      )

      const trigger = getByTestId('trigger') as unknown as Element

      act(() => {
        rtlFireEvent.click(trigger)
      })

      const menu = queryByRole('menu')
      expect(menu).toBeFalsy()
    })

    it('does not crash if trigger element is not found', () => {
      const { queryByRole } = renderWithProviders(
        <ContextMenu
          menuItems={mockMenuItems}
          triggerMode={ContextMenuTriggerMode.Secondary}
          isOpen={true}
          closeMenu={vi.fn()}
        >
          {null}
        </ContextMenu>,
      )

      const menu = queryByRole('menu')
      expect(menu).toBeFalsy()
    })
  })
})
