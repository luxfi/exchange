import { useMemo } from 'react'
<<<<<<< HEAD
import { Flex, FlexProps, styled, Text } from '@l.x/ui/src'
import { RotatableChevron } from '@l.x/ui/src/components/icons/RotatableChevron'
import { AdaptiveDropdown, SharedDropdownProps } from '~/components/Dropdowns/AdaptiveDropdown'
import FilterButton from '~/components/Dropdowns/FilterButton'
=======
import { Flex, FlexProps, styled, Text } from 'ui/src'
import { RotatableChevron } from 'ui/src/components/icons/RotatableChevron'
import { AdaptiveDropdown, SharedDropdownProps } from '~/components/Dropdowns/AdaptiveDropdown'
import { TriggerButton } from '~/components/Dropdowns/TriggerButton'
>>>>>>> upstream/main

export const InternalMenuItem = styled(Text, {
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '$spacing8',
  py: '$spacing12',
  gap: '$gap12',
  color: '$neutral1',
  textDecorationLine: 'none',
  cursor: 'pointer',
  borderRadius: '$rounded8',
  hoverStyle: {
    backgroundColor: '$surface3',
  },
  variants: {
    disabled: {
      true: {
        opacity: 0.6,
        cursor: 'default',
      },
    },
  } as const,
})

export type DropdownProps = SharedDropdownProps & {
  menuLabel: JSX.Element | string
  dataTestId?: string
  hideChevron?: boolean
<<<<<<< HEAD
=======
  chevronSize?: '$icon.16' | '$icon.20'
  isTriggerStyled?: boolean
>>>>>>> upstream/main
  buttonStyle?: FlexProps
  transition?: FlexProps['transition']
}

export function Dropdown({
  menuLabel,
  dataTestId,
  hideChevron,
<<<<<<< HEAD
=======
  chevronSize = '$icon.20',
  isTriggerStyled = true,
>>>>>>> upstream/main
  buttonStyle,
  isOpen,
  toggleOpen,
  transition,
  ...rest
}: DropdownProps) {
  const Trigger = useMemo(
    () => (
<<<<<<< HEAD
      <FilterButton
        onPress={() => toggleOpen(!isOpen)}
        active={isOpen}
=======
      <TriggerButton
        outlined={isTriggerStyled}
        onPress={() => toggleOpen(!isOpen)}
        active={isOpen && isTriggerStyled}
>>>>>>> upstream/main
        aria-label={dataTestId}
        data-testid={dataTestId}
        {...buttonStyle}
        transition={transition}
      >
        <Flex row justifyContent="space-between" alignItems="center" gap="$gap8" width="100%">
          {typeof menuLabel === 'string' ? <Text>{menuLabel}</Text> : menuLabel}
          {!hideChevron && (
<<<<<<< HEAD
            <RotatableChevron animation="200ms" color="$neutral2" direction={isOpen ? 'up' : 'down'} size="$icon.20" />
          )}
        </Flex>
      </FilterButton>
    ),
    [toggleOpen, isOpen, dataTestId, buttonStyle, menuLabel, hideChevron, transition],
=======
            <RotatableChevron
              animation="200ms"
              color="$neutral2"
              direction={isOpen ? 'up' : 'down'}
              size={chevronSize}
            />
          )}
        </Flex>
      </TriggerButton>
    ),
    [toggleOpen, isOpen, dataTestId, isTriggerStyled, buttonStyle, menuLabel, hideChevron, chevronSize, transition],
>>>>>>> upstream/main
  )
  return <AdaptiveDropdown isOpen={isOpen} toggleOpen={toggleOpen} trigger={Trigger} {...rest} />
}
