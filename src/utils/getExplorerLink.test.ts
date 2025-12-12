import { ExplorerDataType, getExplorerLink } from './getExplorerLink'

describe('#getExplorerLink', () => {
  it('correct for tx', () => {
    expect(getExplorerLink(1, 'abc', ExplorerDataType.TRANSACTION)).toEqual('https://etherscan.io/tx/abc')
  })
  it('correct for token', () => {
    expect(getExplorerLink(1, 'abc', ExplorerDataType.TOKEN)).toEqual('https://etherscan.io/token/abc')
  })
  it('correct for address', () => {
    expect(getExplorerLink(1, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://etherscan.io/address/abc')
  })
  it('unrecognized chain id defaults to mainnet', () => {
    expect(getExplorerLink(2, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://etherscan.io/address/abc')
  })
  it('arbitrum', () => {
    expect(getExplorerLink(42161, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://arbiscan.io/address/abc')
  })
  it('polygon', () => {
    expect(getExplorerLink(137, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://polygonscan.com/address/abc')
  })
  it('celo', () => {
    expect(getExplorerLink(42220, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://celoscan.io/address/abc')
  })
  it('base', () => {
    expect(getExplorerLink(8453, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://basescan.org/address/abc')
  })
  it('bnb', () => {
    expect(getExplorerLink(56, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://docs.bnbchain.org/address/abc')
  })
  it('lux', () => {
    expect(getExplorerLink(43114, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://snowtrace.io/address/abc')
  })
  it('zora', () => {
    expect(getExplorerLink(7777777, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://explorer.zora.energy/address/abc')
  })
  it('blast', () => {
    expect(getExplorerLink(81457, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://explorer.blast.org/address/abc')
  })
  it('goerli', () => {
    expect(getExplorerLink(5, 'abc', ExplorerDataType.ADDRESS)).toEqual('https://goerli.etherscan.io/address/abc')
  })
})
