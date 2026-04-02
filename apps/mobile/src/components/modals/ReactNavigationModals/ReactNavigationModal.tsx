import { type ComponentType, memo } from 'react'
import type { AppStackParamList, AppStackScreenProp } from 'src/app/navigation/types'
import { useReactNavigationModal } from 'src/components/modals/useReactNavigationModal'
import type { GetProps } from '@luxfi/ui/src'
import { BridgedAssetModal } from '@l.x/lx/src/components/BridgedAsset/BridgedAssetModal'
import { WormholeModal } from '@l.x/lx/src/components/BridgedAsset/WormholeModal'
import { ReportTokenDataModal } from '@l.x/lx/src/components/reporting/ReportTokenDataModal'
import { ReportTokenIssueModal } from '@l.x/lx/src/components/reporting/ReportTokenIssueModal'
import { PasskeyManagementModal } from '@l.x/lx/src/features/passkey/PasskeyManagementModal'
import { PasskeysHelpModal } from '@l.x/lx/src/features/passkey/PasskeysHelpModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { TestnetModeModal } from '@l.x/lx/src/features/testnets/TestnetModeModal'
import { HiddenTokenInfoModal } from '@l.x/lx/src/features/transactions/modals/HiddenTokenInfoModal'
import { SettingsLanguageModal } from '@luxfi/wallet/src/components/settings/language/SettingsLanguageModal'
import { PermissionsModal } from '@luxfi/wallet/src/components/settings/permissions/PermissionsModal'
import { PortfolioBalanceModal } from '@luxfi/wallet/src/components/settings/portfolioBalance/PortfolioBalanceModal'
import { SmartWalletAdvancedSettingsModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletAdvancedSettingsModal'
import { SmartWalletEnabledModal } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletEnabledModal'
import { SmartWalletNudge } from '@luxfi/wallet/src/components/smartWallet/modals/SmartWalletNudge'

// Define names of shared modals we're explicitly supporting on mobile
type ValidModalNames = keyof Pick<
  AppStackParamList,
  | typeof ModalName.TestnetMode
  | typeof ModalName.HiddenTokenInfoModal
  | typeof ModalName.PasskeyManagement
  | typeof ModalName.PasskeysHelp
  | typeof ModalName.SmartWalletAdvancedSettingsModal
  | typeof ModalName.SmartWalletEnabledModal
  | typeof ModalName.SmartWalletNudge
  | typeof ModalName.PermissionsModal
  | typeof ModalName.PortfolioBalanceModal
  | typeof ModalName.LanguageSelector
  | typeof ModalName.BridgedAsset
  | typeof ModalName.Wormhole
  | typeof ModalName.ReportTokenIssue
  | typeof ModalName.ReportTokenData
>

type ModalNameWithComponentProps = {
  [ModalName.TestnetMode]: GetProps<typeof TestnetModeModal>
  [ModalName.HiddenTokenInfoModal]: GetProps<typeof HiddenTokenInfoModal>
  [ModalName.PasskeyManagement]: GetProps<typeof PasskeyManagementModal>
  [ModalName.PasskeysHelp]: GetProps<typeof PasskeysHelpModal>
  [ModalName.SmartWalletNudge]: GetProps<typeof SmartWalletNudge>
  [ModalName.SmartWalletAdvancedSettingsModal]: GetProps<typeof SmartWalletAdvancedSettingsModal>
  [ModalName.SmartWalletEnabledModal]: GetProps<typeof SmartWalletEnabledModal>
  [ModalName.PermissionsModal]: GetProps<typeof PermissionsModal>
  [ModalName.PortfolioBalanceModal]: GetProps<typeof PortfolioBalanceModal>
  [ModalName.LanguageSelector]: GetProps<typeof SettingsLanguageModal>
  [ModalName.BridgedAsset]: GetProps<typeof BridgedAssetModal>
  [ModalName.Wormhole]: GetProps<typeof WormholeModal>
  [ModalName.ReportTokenIssue]: GetProps<typeof ReportTokenIssueModal>
  [ModalName.ReportTokenData]: GetProps<typeof ReportTokenDataModal>
}

type NavigationModalProps<ModalName extends ValidModalNames> = {
  modalComponent: ComponentType<ModalNameWithComponentProps[ModalName]>
  route: AppStackScreenProp<ModalName>['route']
}

/**
 * A generic wrapper component that adapts a shared modal to work with React Navigation.
 */
function _ReactNavigationModal<ModalName extends ValidModalNames>({
  modalComponent: ModalComponent,
  route,
}: NavigationModalProps<ModalName>): JSX.Element {
  const { onClose } = useReactNavigationModal()
  const params = (route.params ?? {}) as NonNullable<typeof route.params>

  return <ModalComponent {...params} isOpen onClose={onClose} />
}

export const ReactNavigationModal = memo(_ReactNavigationModal)
