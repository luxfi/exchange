import {
  getOverrides,
  LayerProperties,
  Layers,
  setGateOverride,
  setConfigOverride,
  useFeatureFlag,
  FeatureFlags,
  getFeatureFlagName,
} from '@l.x/gating'
import { useFeatureFlagEnabled, useFeatureFlagPayload } from '@hanzo/insights-react'
import { memo, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Flex, Switch, Text, useShadowPropsShort } from '@l.x/ui/src'
import { Flag } from '@l.x/ui/src/components/icons/Flag'
import { Settings } from '@l.x/ui/src/components/icons/Settings'
import { resetLxBehaviorHistory } from '@l.x/lx/src/features/behaviorHistory/slice'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { isBetaEnv, isDevEnv } from '@l.x/utils/src/environment/env'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { GatingRowContent, GatingSwitch } from '~/components/FeatureFlagModal/FeatureFlagModal'
import { MouseoverTooltip, TooltipSize } from '~/components/Tooltip'
import { usePinnedExperiments, usePinnedFeatureFlags } from '~/dev/usePinnedFeatureFlags'
import { useModalState } from '~/hooks/useModalState'
import { EllipsisGuiStyle } from '~/theme/components/styles'

const FLAG_BOX_MAX_WIDTH = 300

function findLayerForParam(paramKey: string): { layerName: Layers; experimentName: string } | null {
  for (const layerName of Object.values(Layers)) {
    if (LayerProperties[layerName].includes(paramKey)) {
      return { layerName: layerName as Layers, experimentName: paramKey }
    }
  }
  return null
}

const Override = (name: string, value: unknown) => {
  return (
    <Text key={name} variant="body3" color="$neutral2">
      {name}: {JSON.stringify(value)}
    </Text>
  )
}

const PinnedFlagRow = memo(function PinnedFlagRow({ gateName }: { gateName: string }): JSX.Element {
  const checked = Boolean(useFeatureFlagEnabled(gateName))

  const onCheckedChange = useEvent((value: boolean): void => {
    setGateOverride(gateName, value)
  })

  return (
    <Flex
      key={gateName}
      row
      alignItems="center"
      justifyContent="space-between"
      gap="$spacing8"
      py="$spacing4"
      onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
    >
      <Text {...EllipsisGuiStyle}>{gateName}</Text>
      <Switch checked={checked} onCheckedChange={onCheckedChange} variant="branded" />
    </Flex>
  )
})

const PinnedExperimentRow = memo(function PinnedExperimentRow({
  layerName,
  experimentName,
}: {
  layerName: Layers
  experimentName: string
}): JSX.Element {
  const payload = useFeatureFlagPayload(layerName as string) as Record<string, unknown> | undefined
  const keys = LayerProperties[layerName]
  const value = keys.reduce<Record<string, unknown>>((acc, key) => ({ ...acc, [key]: payload?.[key] ?? false }), {})
  const checked = Boolean(value[experimentName])
  const onCheckedChange = useEvent((newValue: boolean): void => {
    setConfigOverride(layerName, { ...value, [experimentName]: newValue })
  })

  return (
    <Flex onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}>
      <GatingRowContent
        title={experimentName}
        label={layerName}
        rightContent={<GatingSwitch checked={checked} onCheckedChange={onCheckedChange} />}
      />
    </Flex>
  )
})

export default function DevFlagsBox() {
  const [, force] = useState(0)
  const overrides = useMemo(() => getOverrides(), [])
  const [displayOverrides, setDisplayOverrides] = useState({
    gateOverrides: Object.entries(overrides.gates),
    configOverrides: Object.entries(overrides.configs),
  })

  useEffect(() => {
    const handler = () => {
      const next = getOverrides()
      const gateOverrides = Object.entries(next.gates)
      const configOverrides = Object.entries(next.configs)
      if (gateOverrides.length > 0 || configOverrides.length > 0) {
        setDisplayOverrides({ gateOverrides, configOverrides })
      }
      force((n) => n + 1)
    }
    window.addEventListener('l.x:gating:overrides:changed', handler)
    return () => window.removeEventListener('l.x:gating:overrides:changed', handler)
  }, [])

  const { gateOverrides, configOverrides } = displayOverrides
  const { pinnedFlags } = usePinnedFeatureFlags()
  const { pinnedExperiments } = usePinnedExperiments()
  const shadowProps = useShadowPropsShort()

  const allOverrides = [...gateOverrides, ...configOverrides]

  const overrideRows = allOverrides
    .filter(([name]) => !pinnedFlags.includes(name))
    .map(([name, value]) => Override(name, value))

  const hasFilteredOverrides = overrideRows.length > 0
  const hasPinnedFlags = pinnedFlags.length > 0
  const hasPinnedExperiments = pinnedExperiments.length > 0

  const [isOpen, setIsOpen] = useState(false)
  const { toggleModal: toggleFeatureFlagsModal } = useModalState(ModalName.FeatureFlags)

  const dispatch = useDispatch()

  const onPressReset = (): void => {
    dispatch(resetLxBehaviorHistory())
  }

  return (
    <Flex
      $platform-web={{
        position: 'fixed',
        ...shadowProps,
      }}
      $xl={{
        bottom: 30,
      }}
      bottom="$spacing48"
      left="$spacing20"
      zIndex="$modal"
      padding={10}
      borderWidth="$spacing1"
      borderColor="$surface3"
      borderRadius="$rounded8"
      cursor="pointer"
      backgroundColor="$surface1"
      hoverStyle={{
        backgroundColor: '$surface1Hovered',
      }}
      testID={TestID.DevFlagsBox}
      onPress={() => {
        setIsOpen((prev) => !prev)
      }}
      maxWidth={FLAG_BOX_MAX_WIDTH}
    >
      {isOpen ? (
        <>
          <Flex row justifyContent="space-between" alignItems="center">
            <Text variant="subheading2">
              {isDevEnv() && 'Local Overrides'}
              {isBetaEnv() && 'Staging Overrides'}
            </Text>
            <MouseoverTooltip
              size={TooltipSize.Small}
              text="Protip: Set feature flags by adding '?featureFlagOverride={flag_name}' to the URL"
            >
              <Flex
                centered
                width={30}
                height={30}
                borderRadius="$rounded8"
                testID={TestID.DevFlagsSettingsToggle}
                hoverStyle={{
                  backgroundColor: '$surface1Hovered',
                }}
                onPress={(e) => {
                  e.stopPropagation()
                  toggleFeatureFlagsModal()
                }}
              >
                <Settings size="$icon.16" />
              </Flex>
            </MouseoverTooltip>
          </Flex>
          {hasFilteredOverrides && overrideRows}
          {allOverrides.length === 0 && (
            <Text variant="body3" color="$neutral2">
              No overrides
            </Text>
          )}
          {hasPinnedFlags && (
            <Flex gap="$spacing4" mt="$spacing8" flexDirection="column">
              {pinnedFlags.map((gateName) => (
                <PinnedFlagRow key={gateName} gateName={gateName} />
              ))}
            </Flex>
          )}
          {hasPinnedExperiments && (
            <Flex gap="$spacing4" mt="$spacing8" flexDirection="column">
              {pinnedExperiments
                .map((key) => findLayerForParam(key))
                .filter((resolved): resolved is { layerName: Layers; experimentName: string } => resolved !== null)
                .map(({ layerName, experimentName }) => (
                  <PinnedExperimentRow
                    key={`${layerName}:${experimentName}`}
                    layerName={layerName}
                    experimentName={experimentName}
                  />
                ))}
            </Flex>
          )}
          <Button variant="branded" emphasis="secondary" size="small" onPress={onPressReset} mt="$spacing8">
            Reset behavior history
          </Button>
        </>
      ) : (
        <Flag size="$icon.16" />
      )}
    </Flex>
  )
}

// preserve unused imports for typecheck
void useFeatureFlag
void FeatureFlags
void getFeatureFlagName
