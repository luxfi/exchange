import type { DynamicConfigKeys } from '@luxexchange/gating'
import {
  DynamicConfigs,
  ExternallyConnectableExtensionConfigKey,
  FeatureFlags,
  getFeatureFlagName,
  getOverrideAdapter,
  Layers,
  NetworkRequestsConfigKey,
  useDynamicConfigValue,
  useFeatureFlagWithExposureLoggingDisabled,
} from '@luxexchange/gating'
import type { PropsWithChildren, ReactNode } from 'react'
import { memo } from 'react'
import { Button, Flex, FlexProps, ModalCloseIcon, Switch, styled, Text, TouchableArea } from '@luxfi/ui/src'
import { Pin } from '@luxfi/ui/src/components/icons/Pin'
import { useLayerValue } from 'lx/src/components/gating/Rows'
import { Modal } from 'lx/src/components/modals/Modal'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { isPlaywrightEnv } from '@luxfi/utilities/src/environment/env'
import { TRUSTED_CHROME_EXTENSION_IDS } from '@luxfi/utilities/src/environment/extensionId'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { FeatureFlagSelector } from '~/components/FeatureFlagModal/FeatureFlagSelector'
import { usePinnedExperiments, usePinnedFeatureFlags } from '~/dev/usePinnedFeatureFlags'
import { useModalState } from '~/hooks/useModalState'
import { useExternallyConnectableExtensionId } from '~/pages/ExtensionPasskeyAuthPopUp/useExternallyConnectableExtensionId'
import { EllipsisGuiStyle } from '~/theme/components/styles'

const CenteredRowProps: FlexProps = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: '$gap8',
  maxWidth: '100%',
  gap: '$gap4',
}

const CenteredRow = styled(Flex, CenteredRowProps)

const TouchableCenteredRow = styled(TouchableArea, CenteredRowProps)

const FlagInfo = styled(Flex, {
  flexShrink: 1,
})

interface GatingRowContentProps {
  title: string
  label?: string
  rightContent?: ReactNode
}

export function GatingRowContent({ title, label, rightContent }: GatingRowContentProps): JSX.Element {
  return (
    <CenteredRow flexGrow={1} flexShrink={1} py={rightContent ? '$none' : undefined}>
      <FlagInfo>
        <Text variant="body2" {...EllipsisGuiStyle}>
          {title}
        </Text>
        {label && (
          <Text variant="body4" color="$neutral2" {...EllipsisGuiStyle}>
            {label}
          </Text>
        )}
      </FlagInfo>
      {rightContent}
    </CenteredRow>
  )
}

export function GatingSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}): JSX.Element {
  return (
    <Flex
      onPressIn={(e: { stopPropagation: () => void }) => e.stopPropagation()}
      onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
    >
      <Switch checked={checked} onCheckedChange={onCheckedChange} variant="branded" />
    </Flex>
  )
}

type PinnableRowProps = GatingRowContentProps & {
  isPinned: boolean
  onPinPress: () => void
}

function PinnableRow({ isPinned, onPinPress, title, label, rightContent }: PinnableRowProps): JSX.Element {
  return (
    <TouchableCenteredRow group="item" onPress={onPinPress} gap="$gap8">
      <Flex
        alignSelf="center"
        p="$padding4"
        opacity={isPinned ? 1 : 0}
        $group-item-hover={{ opacity: isPinned ? 1 : 0.6 }}
      >
        <Pin size="$icon.16" color={isPinned ? '$accent1' : '$neutral2'} />
      </Flex>
      <GatingRowContent title={title} label={label} rightContent={rightContent} />
    </TouchableCenteredRow>
  )
}

interface FeatureFlagProps {
  label: string
  flag: FeatureFlags
}

const FeatureFlagGroup = memo(function FeatureFlagGroup({
  name,
  children,
}: PropsWithChildren<{ name: string }>): JSX.Element {
  return (
    <>
      <CenteredRow key={name}>
        <Text variant="body1">{name}</Text>
      </CenteredRow>
      {children}
    </>
  )
})

const FeatureFlagOption = memo(function FeatureFlagOption({ flag, label }: FeatureFlagProps): JSX.Element {
  const enabled = useFeatureFlagWithExposureLoggingDisabled(flag)
  const name = getFeatureFlagName(flag)
  const { isPinned, pinFlag, unpinFlag } = usePinnedFeatureFlags()
  const isOptionPinned = isPinned(name)

  const onFlagVariantChange = useEvent((enabled: boolean) => {
    getOverrideAdapter().overrideGate(name, enabled)
  })

  const onPinPress = useEvent(() => {
    if (isOptionPinned) {
      unpinFlag(name)
    } else {
      pinFlag(name)
    }
  })

  return (
    <PinnableRow
      key={flag}
      isPinned={isOptionPinned}
      onPinPress={onPinPress}
      title={name}
      label={label}
      rightContent={
        <Flex
          onPressIn={(e: { stopPropagation: () => void }) => e.stopPropagation()}
          onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
        >
          <Switch checked={enabled} onCheckedChange={onFlagVariantChange} variant="branded" />
        </Flex>
      }
    />
  )
})

interface LayerOptionProps {
  layerName: Layers
}
const LayerOption = memo(function LayerOption({ layerName }: LayerOptionProps): JSX.Element {
  const { value, overrideValue } = useLayerValue(layerName)
  const { isPinned, pinExperiment, unpinExperiment } = usePinnedExperiments()

  return (
    <>
      {Object.entries(value).map(([key, val]) => {
        return (
          typeof val === 'boolean' && (
            <PinnableRow
              key={key}
              isPinned={isPinned(key)}
              onPinPress={() => (isPinned(key) ? unpinExperiment(key) : pinExperiment(key))}
              title={key}
              label={undefined}
              rightContent={
                <GatingSwitch checked={val} onCheckedChange={(enabled) => overrideValue<boolean>({ [key]: enabled })} />
              }
            />
          )
        )
      })}
    </>
  )
})

const DynamicConfigDropdown = memo(function DynamicConfigDropdown<
  Conf extends Exclude<DynamicConfigs, DynamicConfigs.GasStrategies>,
  Key extends DynamicConfigKeys[Conf],
>({
  config,
  configKey,
  label,
  options,
  selected,
  parser,
}: {
  config: Conf
  configKey: Key
  label: string
  options: Array<string | number> | Record<string, string | number>
  selected: unknown[]
  parser: (opt: string) => unknown
}): JSX.Element {
  const onValueChange = useEvent((value: string) => {
    getOverrideAdapter().overrideDynamicConfig(config, {
      [configKey]: parser(value),
    })
  })

  const currentValue = String(selected[0] ?? '')

  return (
    <CenteredRow key={config}>
      <FlagInfo>
        <Text variant="body2">{config}</Text>
        <Text variant="body4" color="$neutral2">
          {label}
        </Text>
      </FlagInfo>
      <FeatureFlagSelector id={config} value={currentValue} onValueChange={onValueChange} options={options} />
    </CenteredRow>
  )
})

export default function FeatureFlagModal(): JSX.Element {
  const { isOpen, closeModal } = useModalState(ModalName.FeatureFlags)
  const externallyConnectableExtensionId = useExternallyConnectableExtensionId()

  const removeAllOverrides = useEvent(() => {
    getOverrideAdapter().removeAllOverrides()
  })

  const handleReload = useEvent(() => {
    window.location.reload()
  })

  return (
    <Modal name={ModalName.FeatureFlags} isModalOpen={isOpen} onClose={closeModal} padding={0}>
      <Flex py="$gap20" px="$gap16" gap="$gap8">
        <CenteredRow borderBottomColor="$surface3" borderBottomWidth={1} borderRadius={0}>
          <Flex row grow alignItems="center" justifyContent="space-between">
            <Text variant="subheading2">Feature Flag Settings</Text>
            <Button onPress={removeAllOverrides} variant="branded" size="small" fill={false}>
              Clear Overrides
            </Button>
          </Flex>
          <ModalCloseIcon onClose={closeModal} />
        </CenteredRow>
        <Flex
          maxHeight="600px"
          pb="$gap8"
          $platform-web={{ overflowY: 'auto', overflowX: 'hidden' }}
          $md={{ maxHeight: 'unset' }}
        >
          <FeatureFlagGroup name="Sessions">
            <FeatureFlagOption flag={FeatureFlags.SessionsServiceEnabled} label="Enable Sessions Service" />
            <FeatureFlagOption flag={FeatureFlags.SessionsUpgradeAutoEnabled} label="Enable Sessions Upgrade Auto" />
            <FeatureFlagOption flag={FeatureFlags.HashcashSolverEnabled} label="Enable Hashcash Solver" />
            <FeatureFlagOption flag={FeatureFlags.TurnstileSolverEnabled} label="Enable Turnstile Solver" />
            <FeatureFlagOption
              flag={FeatureFlags.SessionsPerformanceTrackingEnabled}
              label="Enable Sessions Performance Tracking"
            />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="FOR API">
            <FeatureFlagOption flag={FeatureFlags.ForSessionsEnabled} label="Enable FOR Sessions" />
            <FeatureFlagOption flag={FeatureFlags.ForUrlMigration} label="Enable FOR URL Migration" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Monad">
            <FeatureFlagOption flag={FeatureFlags.Monad} label="Enable Monad UX" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="XLayer">
            <FeatureFlagOption flag={FeatureFlags.XLayer} label="Enable XLayer UX" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Solana">
            <FeatureFlagOption flag={FeatureFlags.Solana} label="Enable Solana UX" />
            <FeatureFlagOption flag={FeatureFlags.SolanaPromo} label="Turn on Solana promo banners" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Multichain Token UX Improvements">
            <FeatureFlagOption flag={FeatureFlags.MultichainTokenUx} label="Enable Updated Multichain Token UX" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Swap Features">
            <FeatureFlagOption flag={FeatureFlags.NoLuxInterfaceFees} label="Turn off Lux interface fees" />
            <FeatureFlagOption flag={FeatureFlags.ChainedActions} label="Enable Chained Actions" />
            <FeatureFlagOption flag={FeatureFlags.BatchedSwaps} label="Enable Batched Swaps" />
            <FeatureFlagOption flag={FeatureFlags.UnichainFlashblocks} label="Enable Unichain Flashblocks" />
            <FeatureFlagOption flag={FeatureFlags.UniquoteEnabled} label="Enable Uniquote" />
            <FeatureFlagOption flag={FeatureFlags.UnirouteEnabled} label="Enable Uniroute" />
            <FeatureFlagOption flag={FeatureFlags.UniroutePulumiEnabled} label="Enable Uniroute Pulumi" />
            <FeatureFlagOption flag={FeatureFlags.ViemProviderEnabled} label="Enable Viem Provider" />
            <FeatureFlagOption flag={FeatureFlags.LimitsFees} label="Enable Limits fees" />
            <FeatureFlagOption flag={FeatureFlags.EnablePermitMismatchUX} label="Enable Permit2 mismatch detection" />
            <FeatureFlagOption flag={FeatureFlags.NetworkFilterV2} label="Enable Network Filter V2" />
            <FeatureFlagOption flag={FeatureFlags.GasServiceV2} label="Enable Gas Service V2" />
            <FeatureFlagOption
              flag={FeatureFlags.ForcePermitTransactions}
              label="Force Permit2 transaction instead of signatures, always"
            />
            <FeatureFlagOption
              flag={FeatureFlags.ForceDisableWalletGetCapabilities}
              label="Force disable wallet get capabilities result"
            />
            <FeatureFlagOption
              flag={FeatureFlags.AllowDEXOnlyRoutesInSwapSettings}
              label="Allow DEX-Only Routes in Swap Settings (for local testing only)"
            />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="DEX">
            <FeatureFlagOption flag={FeatureFlags.DEX} label="Enable DEX" />
            <FeatureFlagOption
              flag={FeatureFlags.DEXPriorityOrdersBase}
              label="DEX Priority Orders (on Base)"
            />
            <FeatureFlagOption
              flag={FeatureFlags.DEXPriorityOrdersUnichain}
              label="DEX Priority Orders (on Unichain)"
            />
            <FeatureFlagOption flag={FeatureFlags.ArbitrumDutchV3} label="Enable Dutch V3 on Arbitrum" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="LP">
            <FeatureFlagOption
              flag={FeatureFlags.LiquidityBatchedTransactions}
              label="Enable Batched Transactions for LP flow"
            />
            <FeatureFlagOption flag={FeatureFlags.LpDynamicNativeSlippage} label="Enable Dynamic Native Slippage" />
            <FeatureFlagOption flag={FeatureFlags.LpIncentives} label="Enable LP Incentives" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Toucan">
            <FeatureFlagOption flag={FeatureFlags.ToucanAuctionKYC} label="Enable Toucan Auction KYC" />
            <FeatureFlagOption flag={FeatureFlags.ToucanLaunchAuction} label="Enable Toucan Launch Auction" />
            <FeatureFlagOption flag={FeatureFlags.AuctionDetailsV2} label="Enable Auction Details V2" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Embedded Wallet">
            <FeatureFlagOption flag={FeatureFlags.EmbeddedWallet} label="Add internal embedded wallet functionality" />
            <DynamicConfigDropdown
              selected={[externallyConnectableExtensionId]}
              options={TRUSTED_CHROME_EXTENSION_IDS}
              parser={(id) => id}
              config={DynamicConfigs.ExternallyConnectableExtension}
              configKey={ExternallyConnectableExtensionConfigKey.ExtensionId}
              label="Which Extension the web app will communicate with"
            />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="New Chains">
            <FeatureFlagOption flag={FeatureFlags.Soneium} label="Enable Soneium" />
            <FeatureFlagOption flag={FeatureFlags.Tempo} label="Enable Tempo" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Network Requests">
            <NetworkRequestsConfig />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Debug">
            <FeatureFlagOption flag={FeatureFlags.TraceJsonRpc} label="Enables JSON-RPC tracing" />
            <FeatureFlagOption flag={FeatureFlags.AATestWeb} label="A/A Test for Web" />
            {isPlaywrightEnv() && <FeatureFlagOption flag={FeatureFlags.DummyFlagTest} label="Dummy Flag Test" />}
          </FeatureFlagGroup>
          <FeatureFlagGroup name="New Wallet Connectors">
            <FeatureFlagOption flag={FeatureFlags.PortoWalletConnector} label="Enable Porto Wallet Connector" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Portfolio">
            <FeatureFlagOption flag={FeatureFlags.PortfolioDefiTab} label="Enable Portfolio DeFi Tab" />
            <FeatureFlagOption flag={FeatureFlags.ProfitLoss} label="Enable Profit/Loss" />
            <FeatureFlagOption flag={FeatureFlags.SelfReportSpamNFTs} label="Report spam NFTs" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Token Details Page">
            <FeatureFlagOption flag={FeatureFlags.TDPTokenCarousel} label="Enable TDP Token Carousel" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Misc">
            <FeatureFlagOption flag={FeatureFlags.LxWrapped2025} label="Enable Lx Wrapped 2025" />
            <FeatureFlagOption flag={FeatureFlags.UnificationCopy} label="Enable Unification Copy" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Prices">
            <FeatureFlagOption flag={FeatureFlags.CentralizedPrices} label="Enable Centralized Prices" />
          </FeatureFlagGroup>
          <FeatureFlagGroup name="Experiments" />
          <FeatureFlagGroup name="Layers">
            <Flex ml="$padding8" gap="$gap8">
              <FeatureFlagGroup name={Layers.ExplorePage}>
                <LayerOption layerName={Layers.ExplorePage} />
              </FeatureFlagGroup>
              <FeatureFlagGroup name={Layers.SwapPage}>
                <LayerOption layerName={Layers.SwapPage} />
              </FeatureFlagGroup>
            </Flex>
          </FeatureFlagGroup>
        </Flex>
        <Button onPress={handleReload} variant="default" emphasis="secondary" size="small" fill={false}>
          Reload
        </Button>
      </Flex>
    </Modal>
  )
}

function NetworkRequestsConfig() {
  const currentValue = useDynamicConfigValue({
    config: DynamicConfigs.NetworkRequests,
    key: NetworkRequestsConfigKey.BalanceMaxRefetchAttempts,
    defaultValue: 30,
  })

  return (
    <DynamicConfigDropdown
      selected={[currentValue]}
      options={[1, 10, 20, 30]}
      parser={Number.parseInt}
      config={DynamicConfigs.NetworkRequests}
      configKey={NetworkRequestsConfigKey.BalanceMaxRefetchAttempts}
      label="Max refetch attempts"
    />
  )
}
