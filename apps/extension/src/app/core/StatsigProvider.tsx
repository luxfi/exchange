import { useQuery } from '@tanstack/react-query'
import { SharedQueryClient } from '@luxfi/api'
import { StatsigCustomAppValue, StatsigUser } from '@luxfi/gating'
import { useEffect, useState } from 'react'
import { makeStatsigUser } from 'src/app/core/initStatSigForBrowserScripts'
import { StatsigProviderWrapper } from 'lx/src/features/gating/StatsigProviderWrapper'
import { initializeDatadog } from 'lx/src/utils/datadog'
import { uniqueIdQuery } from 'utilities/src/device/uniqueIdQuery'

export function ExtensionStatsigProvider({
  children,
  appName,
}: {
  children: React.ReactNode
  appName: string
}): JSX.Element {
  const { data: uniqueId } = useQuery(uniqueIdQuery(), SharedQueryClient)
  const [initFinished, setInitFinished] = useState(false)
  const [user, setUser] = useState<StatsigUser>({
    userID: undefined,
    custom: {
      app: StatsigCustomAppValue.Extension,
    },
    appVersion: process.env.VERSION,
  })

  useEffect(() => {
    if (uniqueId && initFinished) {
      setUser(makeStatsigUser(uniqueId))
    }
  }, [uniqueId, initFinished])

  const onStatsigInit = (): void => {
    setInitFinished(true)
    initializeDatadog(appName).catch(() => undefined)
  }

  return (
    <StatsigProviderWrapper user={user} onInit={onStatsigInit}>
      {children}
    </StatsigProviderWrapper>
  )
}
