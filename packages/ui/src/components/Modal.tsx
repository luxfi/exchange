import { Dialog, Stack, styled, Text } from 'tamagui'
import { IconButton } from './IconButton'
import { X } from './icons/X'

const ModalHeader = styled(Stack, {
  name: 'ModalHeader',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  mb: '$spacing12',
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
            'quick',
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
          p="$spacing16"
          borderRadius="$rounded16"
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
