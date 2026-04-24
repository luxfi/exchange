import { Text } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import { OptionItemProps } from '@l.x/lx/src/components/lists/items/OptionItem'
import { UnitagOption } from '@l.x/lx/src/components/lists/items/types'
import { WalletBaseOptionItem } from '@l.x/lx/src/components/lists/items/wallets/WalletBaseOptionItem'
import { AccountIcon } from '@l.x/lx/src/features/accounts/AccountIcon'
import { UnitagName } from '@l.x/lx/src/features/unitags/UnitagName'
import { sanitizeAddressText } from '@l.x/lx/src/utils/addresses'
import { shortenAddress } from '@l.x/utils/src/addresses'

type UnitagOptionItemProps = {
  unitagOption: UnitagOption
  onPress: OptionItemProps['onPress']
}

export function UnitagOptionItem({ unitagOption, onPress }: UnitagOptionItemProps): JSX.Element {
  const { address, unitag } = unitagOption

  return (
    <WalletBaseOptionItem
      option={unitagOption}
      image={<AccountIcon address={address} size={iconSizes.icon40} />}
      title={
        <UnitagName
          displayUnitagSuffix
          displayIconInline
          name={unitag}
          textProps={{ variant: 'body1', lineHeight: undefined }}
        />
      }
      subtitle={
        <Text color="$neutral2" variant="body2">
          {sanitizeAddressText(shortenAddress({ address }))}
        </Text>
      }
      onPress={onPress}
    />
  )
}
