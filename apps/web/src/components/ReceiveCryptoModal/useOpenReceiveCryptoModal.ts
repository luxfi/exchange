<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { useEvent } from '@l.x/utils/src/react/hooks'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { useEvent } from 'utilities/src/react/hooks'
>>>>>>> upstream/main
import { ReceiveCryptoModalInitialState } from '~/components/ReceiveCryptoModal/types'
import { setOpenModal } from '~/state/application/reducer'
import { useAppDispatch } from '~/state/hooks'

export function useOpenReceiveCryptoModal(state: ReceiveCryptoModalInitialState) {
  const dispatch = useAppDispatch()

  return useEvent(() =>
    dispatch(
      setOpenModal({
        name: ModalName.ReceiveCryptoModal,
        initialState: state,
      }),
    ),
  )
}
