import { AddressZero } from '@ethersproject/constants'
import { type Currency, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FeeData } from '~/components/Liquidity/Create/types'
import {
  type AuctionTokenAmounts,
  AuctionType,
  CreateAuctionStep,
  type CreateAuctionStoreState,
  DEFAULT_CREATE_AUCTION_STATE,
  DEFAULT_EXISTING_TOKEN_FORM,
  NEW_TOKEN_DECIMALS,
  type PriceRangeStrategy,
  type TokenFormState,
  TokenMode,
} from '~/pages/Liquidity/CreateAuction/types'
import { getRecommendedStrategy } from '~/pages/Liquidity/CreateAuction/utils'

const DEFAULT_AUCTION_SUPPLY_PERCENT = new Percent(25, 100)
export const DEFAULT_POST_AUCTION_LIQUIDITY_PERCENT = new Percent(75, 100)

function buildDefaultBootstrap(totalSupply: CurrencyAmount<Currency>): BootstrapAuctionConfig {
  return {
    auctionType: AuctionType.BOOTSTRAP_LIQUIDITY,
    auctionSupplyAmount: totalSupply.multiply(DEFAULT_AUCTION_SUPPLY_PERCENT),
  }
}

function buildDefaultFundraise(totalSupply: CurrencyAmount<Currency>): FundraiseAuctionConfig {
  const auctionSupplyAmount = totalSupply.multiply(DEFAULT_AUCTION_SUPPLY_PERCENT)
  return {
    auctionType: AuctionType.FUNDRAISE,
    auctionSupplyAmount,
    postAuctionLiquidityAmount: auctionSupplyAmount.multiply(DEFAULT_POST_AUCTION_LIQUIDITY_PERCENT),
