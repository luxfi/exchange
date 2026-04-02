import { NotImplementedError } from '@l.x/utils/src/errors'

export interface CloseIfConsentedProps {
  onClose: () => void
}

export function useCloseIfConsented(_: CloseIfConsentedProps): void {
  throw new NotImplementedError('useCloseIfConsented')
}
