import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { MenuStateVariant, useSetMenu } from '~/components/AccountDrawer/menuState'
import { useAccountDrawer } from '~/components/AccountDrawer/MiniPortfolio/hooks'
import { setOpenModal } from '~/state/application/reducer'

export const OAUTH_PENDING_KEY = 'addBackupLogin:oauthProvider'
export const RECOVER_OAUTH_PENDING_KEY = 'recoverWallet:oauthProvider'

/**
 * Hook that detects an OAuth return (page reload after Privy redirect) and restores the UI:
 * opens the account drawer → PasskeyMenu → AddBackupLogin or RecoverWallet modal.
 *
 * Must be rendered in an always-mounted component (e.g. TopLevelModals).
 */
export function useOAuthRedirectRouter(): void {
  const dispatch = useDispatch()
  const accountDrawer = useAccountDrawer()
  const setMenu = useSetMenu()

  useEffect(() => {
    const hasOAuthParams = new URLSearchParams(window.location.search).has('privy_oauth_code')
    if (!hasOAuthParams) {
      return
    }

    const addBackupPending = sessionStorage.getItem(OAUTH_PENDING_KEY)
    const recoverPending = sessionStorage.getItem(RECOVER_OAUTH_PENDING_KEY)

    if (addBackupPending) {
      accountDrawer.open()
      setMenu({ variant: MenuStateVariant.PASSKEYS })
      dispatch(setOpenModal({ name: ModalName.AddBackupLogin }))
    } else if (recoverPending) {
      dispatch(setOpenModal({ name: ModalName.RecoverWallet }))
    }

    // Clean up OAuth query params from URL (preserve non-Privy params)
    const url = new URL(window.location.href)
    url.searchParams.delete('privy_oauth_code')
    url.searchParams.delete('privy_oauth_state')
    url.searchParams.delete('privy_oauth_provider')
    window.history.replaceState({}, '', url.toString())
  }, [dispatch, accountDrawer, setMenu])
}
