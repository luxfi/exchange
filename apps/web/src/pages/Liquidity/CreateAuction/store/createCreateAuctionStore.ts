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
>>>>>>> upstream/main
  NEW_TOKEN_DECIMALS,
  type PriceRangeStrategy,
  type TokenFormState,
  TokenMode,
} from '~/pages/Liquidity/CreateAuction/types'
import { getRecommendedStrategy } from '~/pages/Liquidity/CreateAuction/utils'

const DEFAULT_AUCTION_SUPPLY_PERCENT = new Percent(25, 100)
<<<<<<< HEAD
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
=======
// 100% means all auctioned tokens go to LP (50% token-side kept, 50% sold for raise-side)
export const BOOTSTRAP_POST_LIQUIDITY_PERCENT = new Percent(100, 100)
// 50% means half go to LP (25% token-side kept, 25% sold); the other 50% are the fundraise
export const FUNDRAISE_POST_LIQUIDITY_PERCENT = new Percent(50, 100)

function buildDefaultAmounts(totalSupply: CurrencyAmount<Currency>, auctionType: AuctionType): AuctionTokenAmounts {
  const auctionSupplyAmount = totalSupply.multiply(DEFAULT_AUCTION_SUPPLY_PERCENT)
  const lpPercent =
    auctionType === AuctionType.BOOTSTRAP_LIQUIDITY
      ? BOOTSTRAP_POST_LIQUIDITY_PERCENT
      : FUNDRAISE_POST_LIQUIDITY_PERCENT
  return {
    totalSupply,
    auctionSupplyAmount,
    postAuctionLiquidityAmount: auctionSupplyAmount.multiply(lpPercent),
  }
}

export type CreateAuctionStore = UseBoundStore<StoreApi<CreateAuctionStoreState>>

export const createCreateAuctionStore = (): CreateAuctionStore =>
  create<CreateAuctionStoreState>()(
    devtools(
      (set) => ({
        step: DEFAULT_CREATE_AUCTION_STATE.step,
        tokenForm: DEFAULT_CREATE_AUCTION_STATE.tokenForm,
              const lpPercent =
                activeAuctionType === AuctionType.BOOTSTRAP_LIQUIDITY
                  ? BOOTSTRAP_POST_LIQUIDITY_PERCENT
                  : FUNDRAISE_POST_LIQUIDITY_PERCENT
              return {
                configureAuction: {
                  ...state.configureAuction,
                  activeAuctionType,
                  committed: {
                    ...committed,
                    postAuctionLiquidityAmount: committed.auctionSupplyAmount.multiply(lpPercent),
                  },
                },
                customizePool: {
                  ...state.customizePool,
                  priceRangeStrategy: getRecommendedStrategy(activeAuctionType),
                },
              }
            })
          },
          setAuctionConfig: (config) => {
            set((state) => {
              const { committed } = state.configureAuction
              if (!committed) {
                return {}
              }
              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed: { ...committed, ...config },
                },
              }
            })
          },
          setStartTime: (startTime) => {
            set((state) => ({ configureAuction: { ...state.configureAuction, startTime } }))
          },
          setMaxDurationDays: (maxDurationDays) => {
            set((state) => ({ configureAuction: { ...state.configureAuction, maxDurationDays } }))
          },
          setRaiseCurrency: (raiseCurrency) => {
            set((state) => ({ configureAuction: { ...state.configureAuction, raiseCurrency } }))
          },
          setFloorPrice: (floorPrice) => {
            set((state) => ({ configureAuction: { ...state.configureAuction, floorPrice } }))
          },
          setFee: (fee: FeeData) => {
            set((state) => ({ customizePool: { ...state.customizePool, fee } }))
          },
          setPriceRangeStrategy: (priceRangeStrategy: PriceRangeStrategy) => {
            set((state) => ({ customizePool: { ...state.customizePool, priceRangeStrategy } }))
          },
          setPoolOwner: (poolOwner: string) => {
            set((state) => ({ customizePool: { ...state.customizePool, poolOwner } }))
          },
          setTimeLockEnabled: (timeLockEnabled: boolean) => {
            set((state) => ({ customizePool: { ...state.customizePool, timeLockEnabled } }))
          },
          setTimeLockDurationDays: (timeLockDurationDays: number) => {
            set((state) => ({ customizePool: { ...state.customizePool, timeLockDurationDays } }))
          },
              const { activeAuctionType, committed: existingCommitted } = state.configureAuction
              const isSameSupply =
                existingCommitted !== undefined &&
                existingCommitted.totalSupply.currency.equals(totalSupply.currency) &&
                existingCommitted.totalSupply.equalTo(totalSupply)
              // When supply changes, slider percentages derived from the old supply become stale,
              // so we intentionally reset amounts to defaults rather than carry them forward.
              const committed = isSameSupply ? existingCommitted : buildDefaultAmounts(totalSupply, activeAuctionType)

              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed,
                },
                step: Math.min(state.step + 1, CreateAuctionStep.REVIEW_LAUNCH) as CreateAuctionStep,
              }
            })
          },
              tokenColor: DEFAULT_CREATE_AUCTION_STATE.tokenColor,
              configureAuction: DEFAULT_CREATE_AUCTION_STATE.configureAuction,
              customizePool: DEFAULT_CREATE_AUCTION_STATE.customizePool,
              xVerification: DEFAULT_CREATE_AUCTION_STATE.xVerification,
            })
          },
        },
      }),
      {
        name: 'createAuctionStore',
        enabled: process.env.NODE_ENV === 'development',
      },
    ),
  )
