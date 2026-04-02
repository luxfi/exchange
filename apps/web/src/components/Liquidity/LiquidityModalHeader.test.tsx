import { LPTransactionSettingsStoreContextProvider } from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/LPTransactionSettingsStoreContextProvider'
import { LiquidityModalHeader } from '~/components/Liquidity/LiquidityModalHeader'
import { WebLuxProvider } from '~/components/Web3Provider/WebLuxContext'
import { ExternalWalletProvider } from '~/features/wallet/providers/ExternalWalletProvider'
import { act, fireEvent, render } from '~/test-utils/render'

describe('LiquidityModalHeader', () => {
  it('should render with given title and call close callback', () => {
    const onClose = vi.fn()
    const { getByText, getByTestId } = render(
      <ExternalWalletProvider>
        <WebLuxProvider>
          <LPTransactionSettingsStoreContextProvider>
            <LiquidityModalHeader title="Test Title" closeModal={onClose} />
          </LPTransactionSettingsStoreContextProvider>
        </WebLuxProvider>
      </ExternalWalletProvider>,
    )
    expect(getByText('Test Title')).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    act(() => {
      fireEvent(getByTestId('LiquidityModalHeader-close'), new MouseEvent('click', { bubbles: true }))
    })
    expect(onClose).toHaveBeenCalled()
  })
})
