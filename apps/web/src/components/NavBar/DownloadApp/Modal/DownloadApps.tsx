import { lazy, PropsWithChildren, ReactNode, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  AnimatedPager,
  Flex,
  FlexProps,
  Image,
  Loader,
  ModalCloseIcon,
  styled,
  Text,
  TouchableArea,
  useSporeColors,
} from '@l.x/ui/src'
import { LUX_LOGO } from '@l.x/ui/src/assets'
import { BackArrow } from '@l.x/ui/src/components/icons/BackArrow'
import { GoogleChromeLogo } from '@l.x/ui/src/components/logos/GoogleChromeLogo'
import { iconSizes, zIndexes } from '@l.x/ui/src/theme'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ElementName, ModalName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { useEvent } from '@l.x/utils/src/react/hooks'
