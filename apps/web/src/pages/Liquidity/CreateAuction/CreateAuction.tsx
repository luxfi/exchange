<<<<<<< HEAD
import { InterfacePageName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
=======
import { InterfacePageName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
>>>>>>> upstream/main
import { CreateAuctionContextProvider } from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { CreateAuctionFormWrapper } from '~/pages/Liquidity/CreateAuction/CreateAuctionFormWrapper'
import { CreateAuctionSteps } from '~/pages/Liquidity/CreateAuction/CreateAuctionSteps'

export default function CreateAuction() {
  return (
    <Trace logImpression page={InterfacePageName.LaunchAuctionPage}>
      <CreateAuctionContextProvider>
        <CreateAuctionFormWrapper>
          <CreateAuctionSteps />
        </CreateAuctionFormWrapper>
      </CreateAuctionContextProvider>
    </Trace>
  )
}
