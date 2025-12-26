import { styled, Stack, Text, Sheet, Adapt, Dialog } from 'tamagui'
import type { GetProps } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
import { IconButton } from './IconButton'

const Overlay = styled(Stack, {
  name: 'ModalOverlay',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  animation: 'quick',
  opacity: 0,
  enterStyle: { opacity: 0 },
  exitStyle: { opacity: 0 },
})

const ModalContent = styled(Stack, {
  name: 'ModalContent',
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$4',
  width: '100%',
  maxWidth: 420,
  maxHeight: '85vh',
  animation: 'medium',
  y: 20,
  opacity: 0,
  enterStyle: { y: 20, opacity: 0 },
  exitStyle: { y: 20, opacity: 0 },
})

const ModalHeader = styled(Stack, {
  name: 'ModalHeader',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '$3',
})

const ModalTitle = styled(Text, {
  name: 'ModalTitle',
  fontSize: 18,
  fontWeight: '600',
  color: '$color',
})

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onOpenChange, title, children }: ModalProps) {
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          key="content"
          bordered
          elevate
          animation={[
            'medium',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          width="100%"
          maxWidth={420}
          padding="$4"
          borderRadius="$4"
        >
          {title && (
            <ModalHeader>
              <Dialog.Title>
                <ModalTitle>{title}</ModalTitle>
              </Dialog.Title>
              <Dialog.Close asChild>
                <IconButton size="sm" variant="default">
                  <X size={16} />
                </IconButton>
              </Dialog.Close>
            </ModalHeader>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
