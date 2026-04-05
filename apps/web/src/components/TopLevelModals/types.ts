import { ComponentProps, ComponentType } from 'react'
<<<<<<< HEAD
import { ModalNameType } from '@l.x/lx/src/features/telemetry/constants'
=======
import { ModalNameType } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main

type ModalComponent = ComponentType<any>

interface ModalConfig {
  component: ModalComponent
  shouldMount: (state: any) => boolean
  isAlwaysMounted?: boolean
}

export interface ModalWrapperProps {
  Component: ModalComponent
  componentProps?: ComponentProps<ModalComponent>
}

export type ModalRegistry = Partial<Record<ModalNameType, ModalConfig>>
