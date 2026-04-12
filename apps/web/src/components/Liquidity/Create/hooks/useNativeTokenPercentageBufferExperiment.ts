import { Experiments, NativeTokenPercentageBufferProperties, useExperimentValue } from '@l.x/gating'

export function useNativeTokenPercentageBufferExperiment(): number {
  const bufferSize = useExperimentValue({
    experiment: Experiments.NativeTokenPercentageBuffer,
    param: NativeTokenPercentageBufferProperties.BufferSize,
    defaultValue: 1,
  })

  return bufferSize
}
