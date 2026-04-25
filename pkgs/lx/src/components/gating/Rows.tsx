import { Experiments, LayerProperties, Layers, setConfigOverride, setExperimentOverride } from '@luxfi/gating'
import { useFeatureFlagPayload } from '@hanzo/insights-react'
import { useCallback } from 'react'
import { Flex, Input, Switch, Text } from '@l.x/ui/src'

export function useLayerValue(
  layerName: Layers,
  layerDefault: unknown = false,
): { value: Record<string, unknown>; overrideValue: <T>(newPairs: Record<string, T>) => void } {
  const payload = useFeatureFlagPayload(layerName as string) as Record<string, unknown> | undefined

  const value = Object.values(LayerProperties[layerName]).reduce(
    (acc, key) => ({ ...acc, [key]: payload?.[key] ?? layerDefault }),
    {},
  )

  const overrideValue = useCallback(
    <T,>(newPairs: Record<string, T>) => {
      setConfigOverride(layerName, { ...value, ...newPairs })
    },
    [layerName, value],
  )

  return { value, overrideValue }
}

export function LayerRow({
  value: layerName,
  layerDefault = false,
}: {
  value: Layers
  layerDefault?: unknown
}): JSX.Element {
  const { value, overrideValue } = useLayerValue(layerName, layerDefault)
  return <Row target={layerName} values={value} overrideValue={overrideValue} />
}

export function ExperimentRow({
  value: experimentName,
  hideTarget = false,
}: {
  value: Experiments
  hideTarget?: boolean
}): JSX.Element {
  const payload = useFeatureFlagPayload(experimentName as string) as Record<string, unknown> | undefined
  const value = payload ?? {}

  const overrideValue = useCallback(
    <T,>(newPairs: Record<string, T>) => {
      setExperimentOverride(experimentName, newPairs)
    },
    [experimentName],
  )

  return <Row target={experimentName} values={value} overrideValue={overrideValue} hideTarget={hideTarget} />
}

function Row({
  target,
  values,
  overrideValue,
  hideTarget = false,
}: {
  target: Experiments | Layers
  values: Record<string, unknown>
  overrideValue: <T>(newPairs: Record<string, T>) => void
  hideTarget?: boolean
}): JSX.Element {
  const handleBooleanChange = useCallback(
    (key: string) => (newValue: boolean) => {
      overrideValue<boolean>({ [key]: newValue })
    },
    [overrideValue],
  )

  const handleNumberChange = useCallback(
    (key: string) => (newValue: string) => {
      overrideValue<number>({ [key]: Number(newValue) })
    },
    [overrideValue],
  )

  const handleStringChange = useCallback(
    (key: string) => (newValue: string) => {
      overrideValue<string>({ [key]: newValue })
    },
    [overrideValue],
  )

  const paramRows = Object.entries(values).map(([key, val]) => {
    let valueElement: JSX.Element | undefined

    if (typeof val === 'boolean') {
      valueElement = <Switch key={key} checked={val} variant="branded" onCheckedChange={handleBooleanChange(key)} />
    } else if (typeof val === 'number') {
      valueElement = <Input value={val.toString()} onChangeText={handleNumberChange(key)} />
    } else if (typeof val === 'string') {
      valueElement = <Input value={val} onChangeText={handleStringChange(key)} />
    }

    return (
      valueElement && (
        <Flex key={key} row alignItems="center" gap="$spacing16" justifyContent="space-between" maxWidth="100%">
          <Text
            variant="body1"
            flexShrink={1}
            $platform-web={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {key}
          </Text>
          {valueElement}
        </Flex>
      )
    )
  })

  return (
    <Flex>
      {!hideTarget && (
        <Text
          variant="body1"
          flexShrink={1}
          $platform-web={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {target}
        </Text>
      )}
      <Flex>
        <Flex gap="$spacing8" pl={hideTarget ? 0 : '$spacing8'}>
          {paramRows}
        </Flex>
      </Flex>
    </Flex>
  )
}
