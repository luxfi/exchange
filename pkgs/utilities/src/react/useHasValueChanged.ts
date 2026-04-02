import { usePreviousWithLayoutEffect } from '@l.x/utils/src/react/usePreviousWithLayoutEffect'

export function useHasValueChanged<ValueType>(value: ValueType): boolean {
  const prevValue = usePreviousWithLayoutEffect(value)

  return prevValue !== value
}
