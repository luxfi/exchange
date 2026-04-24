import { SignMessageFunc, UnitagClaim, UnitagClaimContext } from '@l.x/api'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { UnitagsApiClient } from '@l.x/lx/src/data/apiClients/unitagsApi/UnitagsApiClient'
import { useResetUnitagsQueries } from '@l.x/lx/src/data/apiClients/unitagsApi/useResetUnitagsQueries'
import { pushNotification } from '@l.x/lx/src/features/notifications/slice/slice'
import { AppNotificationType } from '@l.x/lx/src/features/notifications/slice/types'
import { UnitagEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { uploadAndUpdateAvatarAfterClaim } from '@l.x/lx/src/features/unitags/avatars'
import { isLocalFileUri } from '@l.x/lx/src/features/unitags/fileUtils'
import { parseUnitagErrorCode } from '@l.x/lx/src/features/unitags/utils'
import { getUniqueId } from '@l.x/utils/src/device/uniqueId'
import { logger } from '@l.x/utils/src/logger/logger'

type ClaimUnitagInput = {
  claim: UnitagClaim
  context: UnitagClaimContext
  signMessage?: SignMessageFunc
}

/**
 * A custom async hook that handles the process of claiming a Unitag
 * Hook must be used inside the OnboardingContext
 */
export const useClaimUnitag = (): ((input: ClaimUnitagInput) => Promise<{ claimError?: string }>) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const resetUnitagsQueries = useResetUnitagsQueries()

  return async ({ claim, context, signMessage }: ClaimUnitagInput) => {
    const deviceId = await getUniqueId()

    if (!claim.address || !deviceId || !signMessage) {
      logger.error('Missing required parameters', {
        tags: { file: 'useClaimUnitag', function: 'claimUnitag' },
      })
      return { claimError: t('unitags.claim.error.default') }
    }

    try {
      const claimResponse = await UnitagsApiClient.claimUnitag({
        data: {
          username: claim.username,
          deviceId,
          metadata: {
            avatar: claim.avatarUri && isLocalFileUri(claim.avatarUri) ? undefined : claim.avatarUri,
          },
        },
        address: claim.address,
        signMessage,
      })

      if (claimResponse.errorCode) {
        return { claimError: parseUnitagErrorCode(t, claimResponse.errorCode) }
      }

      resetUnitagsQueries()

      if (claimResponse.success) {
        // Log claim success
        sendAnalyticsEvent(UnitagEventName.UnitagClaimed, context)
        if (claim.avatarUri && isLocalFileUri(claim.avatarUri)) {
          const { success: uploadUpdateAvatarSuccess } = await uploadAndUpdateAvatarAfterClaim({
            username: claim.username,
            imageUri: claim.avatarUri,
            address: claim.address,
            signMessage,
          })

          if (!uploadUpdateAvatarSuccess) {
            // Don't block claim flow if avatar upload fails, just dispatch a notification for the error
            dispatch(
              pushNotification({
                type: AppNotificationType.Error,
                errorMessage: t('unitags.claim.error.avatar'),
              }),
            )
          }
        }

        resetUnitagsQueries()
      }

      // Return success (no error)
      return { claimError: undefined }
    } catch (e) {
      logger.error(e, { tags: { file: 'useClaimUnitag', function: 'claimUnitag' } })
      return { claimError: t('unitags.claim.error.default') }
    }
  }
}
