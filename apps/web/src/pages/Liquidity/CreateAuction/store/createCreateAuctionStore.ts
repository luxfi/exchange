import { AddressZero } from '@ethersproject/constants'
import { type Currency, CurrencyAmount, Percent, Token } from '@luxamm/sdk-core'
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FeeData } from '~/components/Liquidity/Create/types'
import {
  AuctionType,
  type BootstrapAuctionConfig,
  CreateAuctionStep,
  type CreateAuctionStoreState,
  DEFAULT_CREATE_AUCTION_STATE,
  DEFAULT_EXISTING_TOKEN_FORM,
  type FundraiseAuctionConfig,
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
  }
}

export type CreateAuctionStore = UseBoundStore<StoreApi<CreateAuctionStoreState>>

export const createCreateAuctionStore = (): CreateAuctionStore =>
  create<CreateAuctionStoreState>()(
    devtools(
      (set) => ({
        step: DEFAULT_CREATE_AUCTION_STATE.step,
        tokenForm: DEFAULT_CREATE_AUCTION_STATE.tokenForm,
        configureAuction: DEFAULT_CREATE_AUCTION_STATE.configureAuction,
        customizePool: DEFAULT_CREATE_AUCTION_STATE.customizePool,
        xVerification: DEFAULT_CREATE_AUCTION_STATE.xVerification,

        actions: {
          setStep: (step) => {
            set({ step })
          },
          goToNextStep: () => {
            set((state) => ({
              step: Math.min(state.step + 1, CreateAuctionStep.REVIEW_LAUNCH) as CreateAuctionStep,
            }))
          },
          goToPreviousStep: () => {
            set((state) => ({
              step: Math.max(state.step - 1, CreateAuctionStep.ADD_TOKEN_INFO) as CreateAuctionStep,
            }))
          },
          setTokenMode: (mode) => {
            set(() => {
              if (mode === TokenMode.CREATE_NEW) {
                return { tokenForm: DEFAULT_CREATE_AUCTION_STATE.tokenForm }
              }
              return { tokenForm: DEFAULT_EXISTING_TOKEN_FORM }
            })
          },
          updateCreateNewTokenField: (key, value) => {
            set((state) => {
              if (state.tokenForm.mode !== TokenMode.CREATE_NEW) {
                return {}
              }
              return { tokenForm: { ...state.tokenForm, [key]: value } }
            })
          },
          updateExistingTokenField: (key, value) => {
            set((state) => {
              if (state.tokenForm.mode !== TokenMode.EXISTING) {
                return {}
              }
              return { tokenForm: { ...state.tokenForm, [key]: value } }
            })
          },
          setTokenForm: (tokenForm: TokenFormState) => {
            set({ tokenForm })
          },
          setXVerification: (value) => {
            set({ xVerification: value })
          },
          setAuctionType: (activeAuctionType) => {
            set((state) => {
              const { committed } = state.configureAuction
              if (!committed) {
                return {}
              }
              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed: { ...committed, activeAuctionType },
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
              const update =
                config.auctionType === AuctionType.BOOTSTRAP_LIQUIDITY ? { bootstrap: config } : { fundraise: config }
              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed: { ...committed, ...update },
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
          commitTokenFormAndAdvance: () => {
            set((state) => {
              const { tokenForm } = state
              let totalSupply

              if (tokenForm.mode === TokenMode.CREATE_NEW) {
                const { network, symbol, name, totalSupply: formSupply } = tokenForm
                const token = new Token(network, AddressZero, NEW_TOKEN_DECIMALS, symbol, name)
                totalSupply = CurrencyAmount.fromRawAmount(token, formSupply.quotient)
              } else {
                totalSupply = tokenForm.totalSupply
              }

              if (!totalSupply) {
                return {}
              }

              const existingCommitted = state.configureAuction.committed
              const isSameSupply =
                existingCommitted !== undefined &&
                existingCommitted.totalSupply.currency.equals(totalSupply.currency) &&
                existingCommitted.totalSupply.equalTo(totalSupply)
              // When supply changes, slider percentages derived from the old supply become stale,
              // so we intentionally reset bootstrap/fundraise to defaults rather than carry them forward.
              const bootstrap = isSameSupply ? existingCommitted.bootstrap : buildDefaultBootstrap(totalSupply)
              const fundraise = isSameSupply ? existingCommitted.fundraise : buildDefaultFundraise(totalSupply)

              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed: {
                    totalSupply,
                    activeAuctionType: existingCommitted?.activeAuctionType ?? AuctionType.BOOTSTRAP_LIQUIDITY,
                    bootstrap,
                    fundraise,
                  },
                },
                step: Math.min(state.step + 1, CreateAuctionStep.REVIEW_LAUNCH) as CreateAuctionStep,
              }
            })
          },
          reset: () => {
            set({
              step: DEFAULT_CREATE_AUCTION_STATE.step,
              tokenForm: DEFAULT_CREATE_AUCTION_STATE.tokenForm,
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
