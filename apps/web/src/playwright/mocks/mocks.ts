import path from 'path'

const portfolioBalancesDir = (name: string) =>
  path.resolve(__dirname, `../mocks/graphql/PortfolioBalances/${name}.json`)

export const PortfolioBalancesMocks = {
  test_wallet: portfolioBalancesDir('test_wallet'),
  hayden: portfolioBalancesDir('hayden'),
  empty: portfolioBalancesDir('empty'),
} as const

export const Mocks = {
  FiatOnRamp: {
    get_country: path.resolve(__dirname, '../mocks/fiatOnRamp/get-country.json'),
    supported_fiat_currencies: path.resolve(__dirname, '../mocks/fiatOnRamp/supported-fiat-currencies.json'),
    supported_countries: path.resolve(__dirname, '../mocks/fiatOnRamp/supported-countries.json'),
    supported_tokens: path.resolve(__dirname, '../mocks/fiatOnRamp/supported-tokens.json'),
    quotes: path.resolve(__dirname, '../mocks/fiatOnRamp/quotes.json'),
  },
  DEX: {
    quote: path.resolve(__dirname, '../mocks/rest/dex/quote.json'),
    openOrder: path.resolve(__dirname, '../mocks/rest/dex/open_order.json'),
    filledOrders: path.resolve(__dirname, '../mocks/rest/dex/filled_orders.json'),
    expiredOrders: path.resolve(__dirname, '../mocks/rest/dex/expired_orders.json'),
    activity: path.resolve(__dirname, '../mocks/graphql/DEX/dex_activity.json'),
  },
  PortfolioBalances: PortfolioBalancesMocks,
  Token: {
    token_warning: path.resolve(__dirname, '../mocks/graphql/Token/token_warning.json'),
    search_token_tether: path.resolve(__dirname, '../mocks/graphql/Token/search_token_tether.json'),
    uni_token: path.resolve(__dirname, '../mocks/graphql/Token/uni_token.json'),
    uni_token_price: path.resolve(__dirname, '../mocks/graphql/Token/uni_token_price.json'),
    sepolia_yay_token: path.resolve(__dirname, '../mocks/graphql/Token/sepolia_yay_token.json'),
    eth_token: path.resolve(__dirname, '../mocks/graphql/Token/eth_token.json'),
    weth_token: path.resolve(__dirname, '../mocks/graphql/Token/weth_token.json'),
  },
  Convert: {
    usd_convert: path.resolve(__dirname, '../mocks/graphql/Convert/usd_convert.json'),
  },
  TokenProjects: {
    token_spam: path.resolve(__dirname, '../mocks/graphql/TokenProjects/token_warning.json'),
    common_bases: path.resolve(__dirname, '../mocks/graphql/TokenProjects/common_bases.json'),
    common_bases_lux: path.resolve(__dirname, '../mocks/graphql/TokenProjects/common_bases_lux.json'),
  },
  TokenWeb: {
    token_warning: path.resolve(__dirname, '../mocks/graphql/TokenWeb/token_warning.json'),
    uni_token: path.resolve(__dirname, '../mocks/graphql/TokenWeb/uni_token.json'),
    sepolia_yay_token: path.resolve(__dirname, '../mocks/graphql/TokenWeb/sepolia_yay_token.json'),
  },
  Search: {
    search_token_uni: path.resolve(__dirname, '../mocks/rest/search/search_token_uni.json'),
  },
  Positions: {
    get_single_sided_v3_position: path.resolve(__dirname, '../mocks/rest/positions/get_single_sided_v3_position.json'),
    get_v3_position: path.resolve(__dirname, '../mocks/rest/positions/get_v3_position.json'),
    get_v4_position: path.resolve(__dirname, '../mocks/rest/positions/get_v4_position.json'),
  },
  Account: {
    tokens: path.resolve(__dirname, '../mocks/graphql/Account/tokens.json'),
    nfts: path.resolve(__dirname, '../mocks/graphql/Account/nfts.json'),
    nfts_empty: path.resolve(__dirname, '../mocks/graphql/Account/nfts_empty.json'),
    full_activity_history: path.resolve(__dirname, '../mocks/graphql/Account/full_activity.json'),
    activity_history: path.resolve(__dirname, '../mocks/graphql/Account/activity_history.json'),
  },
  DataApiService: {
    get_portfolio: path.resolve(__dirname, '../mocks/dataApiService/get_portfolio.json'),
    get_portfolio_empty: path.resolve(__dirname, '../mocks/dataApiService/get_portfolio_empty.json'),
    list_transactions: path.resolve(__dirname, '../mocks/dataApiService/list_transactions.json'),
    list_transactions_empty: path.resolve(__dirname, '../mocks/dataApiService/list_transactions_empty.json'),
  },
  TradingApi: {
    swap: path.resolve(__dirname, '../mocks/tradingApi/swap.json'),
  },
}
