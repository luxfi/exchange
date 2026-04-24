import { faker } from '@l.x/lx/src/test/shared'
import { createFixture } from '@l.x/lx/src/test/utils'
import { DappRequestType, UwULinkRequestInfo, WalletConnectSessionRequestInfo } from '@l.x/lx/src/types/walletConnect'

export const dappInfoWC = createFixture<WalletConnectSessionRequestInfo>()(() => ({
  requestType: DappRequestType.WalletConnectSessionRequest,
  name: faker.lorem.words(),
  url: faker.internet.url(),
  icon: faker.image.imageUrl(),
}))

export const dappInfoUwULink = createFixture<UwULinkRequestInfo>()(() => ({
  requestType: DappRequestType.UwULink,
  name: faker.lorem.words(),
  url: faker.internet.url(),
  icon: faker.image.imageUrl(),
  chain_id: faker.datatype.number(),
}))
