<<<<<<< HEAD
import { SerializedTokenMap, TokenDismissInfo } from '@l.x/lx/src/features/tokens/warnings/slice/types'
=======
import { SerializedTokenMap, TokenDismissInfo } from 'uniswap/src/features/tokens/warnings/slice/types'
>>>>>>> upstream/main
import { UserState } from '~/state/user/reducer'

export type PreV16UserState = UserState & {
  tokens: SerializedTokenMap<TokenDismissInfo>
  userLocale: string | null
}
