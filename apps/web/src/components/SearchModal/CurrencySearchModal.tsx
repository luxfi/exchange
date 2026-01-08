import { Currency } from '@luxamm/sdk-core'
import { SwitchNetworkAction } from 'components/Popups/types'
import { CurrencySearch } from 'components/SearchModal/CurrencySearch'
import { memo } from 'react'
import { Modal } from 'lx/src/components/modals/Modal'
import {
  TOKEN_SELECTOR_WEB_MAX_WIDTH,
  TokenSelectorVariation,
} from 'lx/src/components/TokenSelector/TokenSelector'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { CurrencyField } from 'lx/src/types/currency'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  switchNetworkAction: SwitchNetworkAction
  otherSelectedCurrency?: Currency | null
  showCurrencyAmount?: boolean
  currencyField?: CurrencyField
  chainIds?: UniverseChainId[]
  variation?: TokenSelectorVariation
}

export default memo(function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  currencyField = CurrencyField.INPUT,
  switchNetworkAction,
  chainIds,
  variation,
}: CurrencySearchModalProps) {
  return (
    <Modal
      isModalOpen={isOpen}
      onClose={onDismiss}
      maxHeight={700}
      height="100vh"
      maxWidth={TOKEN_SELECTOR_WEB_MAX_WIDTH}
      padding={0}
      flex={1}
      name={ModalName.CurrencySearch}
    >
      <CurrencySearch
        currencyField={currencyField}
        onCurrencySelect={onCurrencySelect}
        switchNetworkAction={switchNetworkAction}
        onDismiss={onDismiss}
        chainIds={chainIds}
        variation={variation}
      />
    </Modal>
  )
})
