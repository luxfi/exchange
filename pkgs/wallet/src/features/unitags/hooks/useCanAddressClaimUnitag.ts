import { useQuery } from '@tanstack/react-query'
import { UnitagErrorCodes } from '@l.x/api'
import { useUnitagsClaimEligibilityQuery } from '@l.x/lx/src/data/apiClients/unitagsApi/useUnitagsClaimEligibilityQuery'
import { uniqueIdQuery } from '@l.x/utils/src/device/uniqueIdQuery'

export const useCanAddressClaimUnitag = (
  address?: Address,
  isUsernameChange?: boolean,
): { canClaimUnitag: boolean; errorCode?: UnitagErrorCodes } => {
  const { data: deviceId } = useQuery(uniqueIdQuery())
  const skip = !deviceId

  const { isLoading, data } = useUnitagsClaimEligibilityQuery({
    params: skip
      ? undefined
      : {
          address,
          deviceId,
          isUsernameChange,
        },
  })

  return {
    canClaimUnitag: !isLoading && !!data?.canClaim,
    errorCode: data?.errorCode,
  }
}
