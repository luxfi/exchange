import type { Address } from 'viem'

// Contract addresses per chain
export const CONTRACTS: Record<
  number,
  {
    markets: Address
    lssvmPairFactory: Address
    linearCurve: Address
    exponentialCurve: Address
  }
> = {
  // Lux Mainnet (C-Chain)
  96369: {
    markets: '0x308EBD39eB5E27980944630A0af6F8B0d19e31C6',
    lssvmPairFactory: '0x29E3E018C3C19F7713B2dffa3A3c340fD2c7089E',
    linearCurve: '0x360149cC47A3996522376E4131b4A6eB2A1Ca3D3',
    exponentialCurve: '0x28EBC6764A1c7Ed47b38772E197761102b08f3bb',
  },
  // Zoo Mainnet
  200200: {
    markets: '0x49B76d9ca9BcA9e9eDef5e2EC4eD425b2e6b2445',
    lssvmPairFactory: '0x28EBC6764A1c7Ed47b38772E197761102b08f3bb',
    linearCurve: '0x2BaeF607871FB40515Fb42A299a1E0b03F0C681f',
    exponentialCurve: '0x360149cC47A3996522376E4131b4A6eB2A1Ca3D3',
  },
  // Hanzo Mainnet
  36963: {
    markets: '0x6B7D3c38A3e030B95E101927Ee6ff9913ef626d4',
    lssvmPairFactory: '0x60b2d8E6B5B0FEeE529DcC6c460C44eed7b2E82A',
    linearCurve: '0x719685C371ce4C4720d3D7877CBf9bc867Ac39a6',
    exponentialCurve: '0xB4e242f9417872A843B2D0b92FCf89055349ABb5',
  },
  // SPC Mainnet
  36911: {
    markets: '0x9BC44B0De1aBe2e436C8fA5Cd5cA519026b9D8fD',
    lssvmPairFactory: '0x38E71f39f3f46907E03C48983F6578F9a8c2e72e',
    linearCurve: '0x9607F59f2377Dff9A56D0A76F0313040070c08CD',
    exponentialCurve: '0xdE5280a9306da7829A4Ba1fBf87B58e1bB4F4A53',
  },
  // Pars Mainnet
  494949: {
    markets: '0x3589fd09e7dfF3f7653fc4965B7CE1b8d8fdA9Bd',
    lssvmPairFactory: '0xb43dB9AF0C5CACb99f783E30398Ee0AEe6744212',
    linearCurve: '0xd13AB81F02449B1630ecd940Be5Fb9CD367225B4',
    exponentialCurve: '0xBc92f4e290F8Ad03F5348F81a27fb2Af3B37ec47',
  },
}

// Market.sol ABI (Seaport-based)
export const MARKET_ABI = [
  {
    name: 'list',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'paymentToken', type: 'address' },
      { name: 'price', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
    ],
    outputs: [{ name: 'listingId', type: 'bytes32' }],
  },
  {
    name: 'cancelListing',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'listingId', type: 'bytes32' }],
    outputs: [],
  },
  {
    name: 'buy',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'listingId', type: 'bytes32' }],
    outputs: [],
  },
  {
    name: 'makeOffer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'paymentToken', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
    ],
    outputs: [{ name: 'offerId', type: 'bytes32' }],
  },
  {
    name: 'cancelOffer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'offerId', type: 'bytes32' }],
    outputs: [],
  },
  {
    name: 'acceptOffer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'offerId', type: 'bytes32' }],
    outputs: [],
  },
  {
    name: 'getListing',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'listingId', type: 'bytes32' }],
    outputs: [
      { name: 'seller', type: 'address' },
      { name: 'nftContract', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
      { name: 'paymentToken', type: 'address' },
      { name: 'price', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
  },
  {
    name: 'Listing',
    type: 'event',
    inputs: [
      { name: 'listingId', type: 'bytes32', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'nftContract', type: 'address', indexed: false },
      { name: 'tokenId', type: 'uint256', indexed: false },
      { name: 'price', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'Sale',
    type: 'event',
    inputs: [
      { name: 'listingId', type: 'bytes32', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'price', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'OfferMade',
    type: 'event',
    inputs: [
      { name: 'offerId', type: 'bytes32', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'nftContract', type: 'address', indexed: false },
      { name: 'tokenId', type: 'uint256', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
] as const

// ERC721 ABI (minimal for NFT queries)
export const ERC721_ABI = [
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'ownerOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ type: 'address' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'setApprovalForAll',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'isApprovedForAll',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

// ERC1155 minimal ABI
export const ERC1155_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'uri',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ type: 'string' }],
  },
  {
    name: 'setApprovalForAll',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' },
    ],
    outputs: [],
  },
  {
    name: 'isApprovedForAll',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
] as const

// LSSVM Pair ABI (sudoswap AMM for NFTs)
export const LSSVM_PAIR_ABI = [
  {
    name: 'swapTokenForSpecificNFTs',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'nftIds', type: 'uint256[]' },
      { name: 'maxExpectedTokenInput', type: 'uint256' },
      { name: 'nftRecipient', type: 'address' },
      { name: 'isRouter', type: 'bool' },
      { name: 'routerCaller', type: 'address' },
    ],
    outputs: [{ name: 'inputAmount', type: 'uint256' }],
  },
  {
    name: 'swapNFTsForToken',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'nftIds', type: 'uint256[]' },
      { name: 'minExpectedTokenOutput', type: 'uint256' },
      { name: 'tokenRecipient', type: 'address' },
      { name: 'isRouter', type: 'bool' },
      { name: 'routerCaller', type: 'address' },
    ],
    outputs: [{ name: 'outputAmount', type: 'uint256' }],
  },
  {
    name: 'getBuyNFTQuote',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'assetId', type: 'uint256' },
      { name: 'numNFTs', type: 'uint256' },
    ],
    outputs: [
      { name: 'error', type: 'uint8' },
      { name: 'newSpotPrice', type: 'uint256' },
      { name: 'newDelta', type: 'uint256' },
      { name: 'inputAmount', type: 'uint256' },
      { name: 'protocolFee', type: 'uint256' },
      { name: 'royaltyAmount', type: 'uint256' },
    ],
  },
  {
    name: 'getSellNFTQuote',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'assetId', type: 'uint256' },
      { name: 'numNFTs', type: 'uint256' },
    ],
    outputs: [
      { name: 'error', type: 'uint8' },
      { name: 'newSpotPrice', type: 'uint256' },
      { name: 'newDelta', type: 'uint256' },
      { name: 'outputAmount', type: 'uint256' },
      { name: 'protocolFee', type: 'uint256' },
      { name: 'royaltyAmount', type: 'uint256' },
    ],
  },
  {
    name: 'spotPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint128' }],
  },
  {
    name: 'nft',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const
