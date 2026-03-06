import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { Flex, Text, Tooltip } from 'ui/src'
import { Snowflake } from 'ui/src/components/icons/Snowflake'
import { zIndexes } from 'ui/src/theme'
import { WRAPPED_PATH } from 'lx/src/components/banners/shared/utils'
import { selectHasDismissedLuxWrapped2025Banner } from 'lx/src/features/behaviorHistory/selectors'
import { setHasDismissedLuxWrapped2025Banner } from 'lx/src/features/behaviorHistory/slice'
import { ElementName } from 'lx/src/features/telemetry/constants'
import Trace from 'lx/src/features/telemetry/Trace'
import { isMobileWeb } from 'utilities/src/platform'
import { useAppDispatch, useAppSelector } from '~/state/hooks'

const snowflakeHoverKeyframes = `
  @keyframes snowflakeHover {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }

  .snowflake-icon {
    cursor: pointer;
    transition: color 300ms ease;
  }

  @media (hover: hover) {
    .snowflake-icon:hover {
      animation: snowflakeHover 300ms ease;
    }
  }
`

export function LuxWrappedEntry() {
  const isLuxWrapped2025Enabled = useFeatureFlag(FeatureFlags.LuxWrapped2025)
  const isDismissed = useAppSelector(selectHasDismissedLuxWrapped2025Banner)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handlePress = useCallback(() => {
    dispatch(setHasDismissedLuxWrapped2025Banner(true))
    navigate(WRAPPED_PATH)
  }, [dispatch, navigate])

  return (
    isLuxWrapped2025Enabled &&
    isDismissed && (
      <>
        <style>{snowflakeHoverKeyframes}</style>
        <Tooltip placement="bottom" offset={{ mainAxis: 8 }} delay={{ open: 300 }}>
          <Tooltip.Trigger>
            <Trace logPress element={ElementName.LuxWrappedNavbarButton}>
              <Text
                className="snowflake-icon"
                color="$neutral2"
                hoverStyle={{ color: '$accent1' }}
                height="$spacing24"
                onPress={handlePress}
              >
                <Snowflake size="$icon.24" color="inherit" />
              </Text>
            </Trace>
          </Tooltip.Trigger>
          <Tooltip.Content zIndex={zIndexes.overlay} display={isMobileWeb ? 'none' : 'flex'}>
            <Tooltip.Arrow />
            <Flex centered>
              <Text variant="buttonLabel4" color="$accent1">
                {t('home.banner.luxWrapped2025.title')}
              </Text>
              <Text variant="body4" color="$neutral2">
                {t('home.banner.luxWrapped2025.subtitle')}
              </Text>
            </Flex>
          </Tooltip.Content>
        </Tooltip>
      </>
    )
  )
}
