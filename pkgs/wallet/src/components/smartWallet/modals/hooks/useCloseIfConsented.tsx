import { NotImplementedError } from '@luxfi/utilities/src/errors'

export interface CloseIfConsentedProps {
  onClose: () => void
}

export function useCloseIfConsented(_: CloseIfConsentedProps): void {
  throw new NotImplementedError('useCloseIfConsented')
}
