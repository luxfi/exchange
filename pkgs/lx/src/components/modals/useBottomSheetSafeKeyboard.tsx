import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export interface KeyboardInfo {
  keyboardHeight: number
}

export function useBottomSheetSafeKeyboard(): KeyboardInfo {
  throw new PlatformSplitStubError('useBottomSheetSafeKeyboard')
}
