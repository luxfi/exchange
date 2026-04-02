import { usePreviousWithLayoutEffect } from '@luxfi/utilities/src/react/usePreviousWithLayoutEffect'

/**
 * @param value boolean value
 * @returns if value provided has become truthy
 */
const useHasValueBecomeTruthy = <ValueType>(value: ValueType): boolean => {
  const prevValue = usePreviousWithLayoutEffect(value)

  return !prevValue && !!value
}

export { useHasValueBecomeTruthy }
