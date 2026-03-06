import { configureStore } from '@reduxjs/toolkit'
import { addFavoriteToken } from 'lx/src/features/favorites/slice'
import { pushNotification } from 'lx/src/features/notifications/slice/slice'
import { AppNotificationType } from 'lx/src/features/notifications/slice/types'
import { createAppStateResetter } from 'lx/src/state/createAppStateResetter'
import { type LuxState, luxReducer } from 'lx/src/state/luxReducer'
import { sleep } from 'utilities/src/time/timing'
import type { Mock } from 'vitest'

describe('createAppStateResetter', () => {
  let store: ReturnType<typeof configureStore<LuxState>>
  let resetter: ReturnType<typeof createAppStateResetter>
  let onResetAccountHistory: Mock
  let onResetUserSettings: Mock
  let onResetQueryCaches: Mock

  beforeEach(() => {
    store = configureStore({
      reducer: luxReducer,
    })
    onResetAccountHistory = vi.fn()
    onResetUserSettings = vi.fn()
    onResetQueryCaches = vi.fn()
    resetter = createAppStateResetter({
      dispatch: store.dispatch,
      onResetAccountHistory,
      onResetUserSettings,
      onResetQueryCaches,
    })
  })

  describe('resetAccountHistory', () => {
    it('dispatches account history reset actions', async () => {
      // Modify state first
      store.dispatch(
        pushNotification({
          type: AppNotificationType.Success,
          title: 'Test notification',
        }),
      )

      // Verify state was modified
      expect(store.getState().notifications.notificationQueue.length).toBe(1)

      await resetter.resetAccountHistory()

      // Verify state was reset
      const state = store.getState()
      expect(state.notifications.notificationQueue).toEqual([]) // clearNotificationQueue effect
    })

    it('calls onResetAccountHistory callback', async () => {
      await resetter.resetAccountHistory()

      expect(onResetAccountHistory).toHaveBeenCalledTimes(1)
    })
  })

  describe('resetUserSettings', () => {
    it('dispatches user settings reset actions', async () => {
      // Modify lux-specific state
      const initialTokenCount = store.getState().favorites.tokens.length
      store.dispatch(addFavoriteToken({ currencyId: 'test-currency-id' }))

      // Verify state was modified
      expect(store.getState().favorites.tokens.length).toBe(initialTokenCount + 1)

      await resetter.resetUserSettings()

      // Verify lux state was reset
      const state = store.getState()
      expect(state.favorites.tokens.length).toBe(initialTokenCount) // resetFavorites restores defaults
    })

    it('calls onResetUserSettings callback', async () => {
      await resetter.resetUserSettings()

      expect(onResetUserSettings).toHaveBeenCalledTimes(1)
    })
  })

  describe('resetQueryCaches', () => {
    it('calls onResetQueryCaches callback', async () => {
      await resetter.resetQueryCaches()

      expect(onResetQueryCaches).toHaveBeenCalledTimes(1)
    })
  })

  describe('resetAll', () => {
    it('calls all three reset methods', async () => {
      await resetter.resetAll()

      expect(onResetAccountHistory).toHaveBeenCalledTimes(1)
      expect(onResetUserSettings).toHaveBeenCalledTimes(1)
      expect(onResetQueryCaches).toHaveBeenCalledTimes(1)
    })
  })

  describe('async callback support', () => {
    it('awaits async callbacks', async () => {
      const asyncCallback = vi.fn(async () => {
        await sleep(10)
      })

      const asyncResetter = createAppStateResetter({
        dispatch: store.dispatch,
        onResetAccountHistory: asyncCallback,
        onResetUserSettings,
        onResetQueryCaches,
      })

      await asyncResetter.resetAccountHistory()

      expect(asyncCallback).toHaveBeenCalledTimes(1)
    })
  })
})
