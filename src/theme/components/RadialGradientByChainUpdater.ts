import { useWeb3React } from '@web3-react/core'
import { useIsNftPage } from 'hooks/useIsNftPage'
import { useEffect } from 'react'
import { useDarkModeManager } from 'state/user/hooks'

import { SupportedChainId } from '../../constants/chains'
import { darkTheme, lightTheme } from '../colors'

const initialStyles = {
  width: '200vw',
  height: '200vh',
  transform: 'translate(-50vw, -100vh)',
}
const backgroundResetStyles = {
  width: '100vw',
  height: '100vh',
  transform: 'unset',
}

type TargetBackgroundStyles = typeof initialStyles | typeof backgroundResetStyles

const backgroundRadialGradientElement = document.getElementById('background-radial-gradient')
const setBackground = (newValues: TargetBackgroundStyles) =>
  Object.entries(newValues).forEach(([key, value]) => {
    if (backgroundRadialGradientElement) {
      backgroundRadialGradientElement.style[key as keyof typeof backgroundResetStyles] = value
    }
  })

export default function RadialGradientByChainUpdater(): null {
  const { chainId } = useWeb3React()
  const [darkMode] = useDarkModeManager()
  const isNftPage = useIsNftPage()

  // manage background color
  useEffect(() => {
    if (!backgroundRadialGradientElement) {
      return
    }

    if (isNftPage) {
      setBackground(initialStyles)
      backgroundRadialGradientElement.style.background = darkMode
        ? darkTheme.backgroundBackdrop
        : lightTheme.backgroundBackdrop
      return
    }

    switch (chainId) {
      case SupportedChainId.ARBITRUM_ONE:
      case SupportedChainId.ARBITRUM_RINKEBY: {
        setBackground(backgroundResetStyles)
        const arbitrumLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(205, 232, 251, 0.7) 0%, rgba(252, 243, 249, 0.6536) 49.48%, rgba(255, 255, 255, 0) 100%), #FFFFFF'
        const arbitrumDarkGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(10, 41, 75, 0.7) 0%, rgba(34, 30, 48, 0.6536) 49.48%, rgba(31, 33, 40, 0) 100%), #0D0E0E'
        backgroundRadialGradientElement.style.background = darkMode ? arbitrumDarkGradient : arbitrumLightGradient
        break
      }
      case SupportedChainId.OPTIMISM:
      case SupportedChainId.OPTIMISM_GOERLI: {
        setBackground(backgroundResetStyles)
        const optimismLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(255, 251, 242, 0.8) 0%, rgba(255, 244, 249, 0.6958) 50.52%, rgba(255, 255, 255, 0) 100%), #FFFFFF'
        const optimismDarkGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(62, 46, 56, 0.8) 0%, rgba(44, 31, 45, 0.6958) 50.52%, rgba(31, 33, 40, 0) 100%), #0D0E0E'
        backgroundRadialGradientElement.style.background = darkMode ? optimismDarkGradient : optimismLightGradient
        break
      }
      case SupportedChainId.POLYGON:
      case SupportedChainId.POLYGON_MUMBAI: {
        setBackground(backgroundResetStyles)
        const polygonLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(130, 71, 229, 0.2) 0%, rgba(200, 168, 255, 0.05) 52.6%, rgba(0, 0, 0, 0) 100%), #FFFFFF'
        const polygonDarkGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(130, 71, 229, 0.2) 0%, rgba(200, 168, 255, 0.05) 52.6%, rgba(0, 0, 0, 0) 100%), #0D0E0E'
        backgroundRadialGradientElement.style.background = darkMode ? polygonDarkGradient : polygonLightGradient
        break
      }
      case SupportedChainId.BASE: {
        setBackground(backgroundResetStyles)
        const baseLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(0, 15, 50, 0.41) 0%, rgba(20, 20, 20, 0.24) 100%), #FFFFFF'
        const baseDarkGradient =
          'radial-gradient(circle at center, #222232 0%, #000000 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? baseDarkGradient : baseLightGradient
        break
      }
      case SupportedChainId.AVALANCHE: {
        setBackground(backgroundResetStyles)
        const baseLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(0, 15, 50, 0.41) 0%, rgba(20, 20, 20, 0.24) 100%), #FFFFFF'
        const baseDarkGradient =
          'radial-gradient(circle at center, #422222 0%, #000000 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? baseDarkGradient : baseLightGradient
        break
      }
      case SupportedChainId.BNB: {
        setBackground(backgroundResetStyles)
        const baseLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(0, 15, 50, 0.41) 0%, rgba(20, 20, 20, 0.24) 100%), #FFFFFF'
        const baseDarkGradient =
          'radial-gradient(circle at center, #424222 0%, #000000 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? baseDarkGradient : baseLightGradient
        break
      }
      case SupportedChainId.ZORA: {
        setBackground(backgroundResetStyles)
        const baseLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(0, 15, 50, 0.41) 0%, rgba(20, 20, 20, 0.24) 100%), #FFFFFF'
        const baseDarkGradient =
          'radial-gradient(circle at center, #292039 0%, #000000 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? baseDarkGradient : baseLightGradient
        break
      }
      case SupportedChainId.BLAST: {
        setBackground(backgroundResetStyles)
        const baseLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(0, 15, 50, 0.41) 0%, rgba(20, 20, 20, 0.24) 100%), #FFFFFF'
        const baseDarkGradient =
          'radial-gradient(circle at center, #323922 0%, #000000 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? baseDarkGradient : baseLightGradient
        break
      }

      case SupportedChainId.CELO:
      case SupportedChainId.CELO_ALFAJORES: {
        setBackground(backgroundResetStyles)
        const celoLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(186, 228, 210, 0.7) 0%, rgba(252, 243, 249, 0.6536) 49.48%, rgba(255, 255, 255, 0) 100%), #FFFFFF'
        const celoDarkGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(20, 49, 37, 0.29) 0%, rgba(12, 31, 23, 0.6536) 49.48%, rgba(31, 33, 40, 0) 100%, rgba(31, 33, 40, 0) 100%), #0D0E0E'
        backgroundRadialGradientElement.style.background = darkMode ? celoDarkGradient : celoLightGradient
        break
      }
      case SupportedChainId.LUX:
      case SupportedChainId.LUX_TESTNET: {
        setBackground(backgroundResetStyles)
        const luxLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(0, 15, 50, 0.41) 0%, rgba(20, 20, 20, 0.24) 100%), #FFFFFF'
        const luxDarkGradient = 'radial-gradient(circle at center, #121212 0%, #000000 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? luxDarkGradient : luxLightGradient
        break
      }
      case SupportedChainId.ZOO: {
        setBackground(backgroundResetStyles)
        const luxLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(0, 15, 50, 0.25) 0%, rgba(220, 220, 220, 0.6) 100%), #FFFFFF'
        const luxDarkGradient = 'radial-gradient(100% 100% at 0% 50%, #2A2A2A 0%, #101010 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? luxDarkGradient : luxLightGradient
        break
      }
      default: {
        setBackground(initialStyles)
        const defaultLightGradient =
          'radial-gradient(100% 100% at 50% 0%, rgba(255, 184, 226, 0.51) 0%, rgba(255, 255, 255, 0) 100%), #FFFFFF'
        const defaultDarkGradient = 'radial-gradient(circle at center, #121212 0%, #000000 100%)'
        backgroundRadialGradientElement.style.background = darkMode ? defaultDarkGradient : defaultLightGradient
      }
    }
  }, [darkMode, chainId, isNftPage])
  return null
}