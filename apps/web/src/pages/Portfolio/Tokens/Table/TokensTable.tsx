import { NetworkStatus } from '@apollo/client'
import { SharedEventName } from '@uniswap/analytics-events'
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollSync } from 'react-scroll-sync'
import { Flex } from 'ui/src'
import { ElementName, SectionName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { useTrace } from 'utilities/src/telemetry/trace/TraceContext'
import { PortfolioExpandoRow } from '~/pages/Portfolio/components/PortfolioExpandoRow'
import { TokenData } from '~/pages/Portfolio/Tokens/hooks/useTransformTokenTableData'
import { TokenColumns } from '~/pages/Portfolio/Tokens/Table/columns/useTokenColumns'
import { TokensTableInner } from '~/pages/Portfolio/Tokens/Table/TokensTableInner'

const TOKENS_TABLE_MAX_HEIGHT = 700

interface TokensTableProps {
  visible: TokenData[]
  hidden: TokenData[]
  loading: boolean
  refetching?: boolean
  networkStatus: NetworkStatus
  error?: Error | undefined
}

export function TokensTable({ visible, hidden, loading, refetching, error }: TokensTableProps) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const tableLoading = loading && !refetching
  const trace = useTrace()
          hiddenColumns={hiddenColumns}
          maxHeight={TOKENS_TABLE_MAX_HEIGHT}
        />
        {hidden.length > 0 && (
          <>
            <PortfolioExpandoRow
              isExpanded={isOpen}
              label={t('hidden.tokens.info.text.button', { numHidden: hidden.length })}
              onPress={handleToggleHiddenTokens}
              dataTestId={TestID.ShowHiddenTokens}
            />
            {isOpen && (
              <TokensTableInner
                showHiddenTokensBanner
                tokenData={hidden}
                hideHeader
                loading={tableLoading}
                error={error}
                hiddenColumns={hiddenColumns}
                maxHeight={TOKENS_TABLE_MAX_HEIGHT}
              />
            )}
          </>
        )}
      </Flex>
    </ScrollSync>
  )
}
