import { InterfacePageName } from 'lx/src/features/telemetry/constants'
import Trace from 'lx/src/features/telemetry/Trace'
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
