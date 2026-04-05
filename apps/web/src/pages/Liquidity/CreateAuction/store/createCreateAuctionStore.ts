import { AddressZero } from '@ethersproject/constants'
<<<<<<< HEAD
import { type Currency, CurrencyAmount, Percent, Token } from '@luxamm/sdk-core'
=======
import { type Currency, CurrencyAmount, Percent, Token } from '@uniswap/sdk-core'
>>>>>>> upstream/main
import type { StoreApi, UseBoundStore } from 'zustand'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { FeeData } from '~/components/Liquidity/Create/types'
import {
<<<<<<< HEAD
  AuctionType,
  type BootstrapAuctionConfig,
=======
  type AuctionTokenAmounts,
  AuctionType,
>>>>>>> upstream/main
  CreateAuctionStep,
  type CreateAuctionStoreState,
  DEFAULT_CREATE_AUCTION_STATE,
  DEFAULT_EXISTING_TOKEN_FORM,
<<<<<<< HEAD
  type FundraiseAuctionConfig,
=======
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
>>>>>>> upstream/main
  }
}

export type CreateAuctionStore = UseBoundStore<StoreApi<CreateAuctionStoreState>>

export const createCreateAuctionStore = (): CreateAuctionStore =>
  create<CreateAuctionStoreState>()(
    devtools(
      (set) => ({
        step: DEFAULT_CREATE_AUCTION_STATE.step,
        tokenForm: DEFAULT_CREATE_AUCTION_STATE.tokenForm,
<<<<<<< HEAD
=======
        tokenColor: DEFAULT_CREATE_AUCTION_STATE.tokenColor,
>>>>>>> upstream/main
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
<<<<<<< HEAD
              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed: { ...committed, activeAuctionType },
=======
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
>>>>>>> upstream/main
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
<<<<<<< HEAD
              const update =
                config.auctionType === AuctionType.BOOTSTRAP_LIQUIDITY ? { bootstrap: config } : { fundraise: config }
              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed: { ...committed, ...update },
=======
              return {
                configureAuction: {
                  ...state.configureAuction,
                  committed: { ...committed, ...config },
>>>>>>> upstream/main
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
<<<<<<< HEAD
=======
          setSendFeesEnabled: (sendFeesEnabled: boolean) => {
            set((state) => ({ customizePool: { ...state.customizePool, sendFeesEnabled } }))
          },
          setFeesRecipientAddress: (feesRecipientAddress: string) => {
            set((state) => ({ customizePool: { ...state.customizePool, feesRecipientAddress } }))
          },
          setBuybackAndBurnEnabled: (buybackAndBurnEnabled: boolean) => {
            set((state) => ({ customizePool: { ...state.customizePool, buybackAndBurnEnabled } }))
          },
>>>>>>> upstream/main
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

<<<<<<< HEAD
              const existingCommitted = state.configureAuction.committed
=======
              const { activeAuctionType, committed: existingCommitted } = state.configureAuction
>>>>>>> upstream/main
              const isSameSupply =
                existingCommitted !== undefined &&
                existingCommitted.totalSupply.currency.equals(totalSupply.currency) &&
                existingCommitted.totalSupply.equalTo(totalSupply)
              // When supply changes, slider percentages derived from the old supply become stale,
<<<<<<< HEAD
              // so we intentionally reset bootstrap/fundraise to defaults rather than carry them forward.
              const bootstrap = isSameSupply ? existingCommitted.bootstrap : buildDefaultBootstrap(totalSupply)
              const fundraise = isSameSupply ? existingCommitted.fundraise : buildDefaultFundraise(totalSupply)
=======
              // so we intentionally reset amounts to defaults rather than carry them forward.
              const committed = isSameSupply ? existingCommitted : buildDefaultAmounts(totalSupply, activeAuctionType)
>>>>>>> upstream/main

              return {
                configureAuction: {
                  ...state.configureAuction,
<<<<<<< HEAD
                  committed: {
                    totalSupply,
                    activeAuctionType: existingCommitted?.activeAuctionType ?? AuctionType.BOOTSTRAP_LIQUIDITY,
                    bootstrap,
                    fundraise,
                  },
=======
                  committed,
>>>>>>> upstream/main
                },
                step: Math.min(state.step + 1, CreateAuctionStep.REVIEW_LAUNCH) as CreateAuctionStep,
              }
            })
          },
<<<<<<< HEAD
=======
          setTokenColor: (tokenColor) => {
            set({ tokenColor })
          },
>>>>>>> upstream/main
          reset: () => {
            set({
              step: DEFAULT_CREATE_AUCTION_STATE.step,
              tokenForm: DEFAULT_CREATE_AUCTION_STATE.tokenForm,
<<<<<<< HEAD
=======
              tokenColor: DEFAULT_CREATE_AUCTION_STATE.tokenColor,
>>>>>>> upstream/main
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
