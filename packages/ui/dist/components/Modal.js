import { X } from '@tamagui/lucide-icons'
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { Dialog, Stack, styled, Text } from 'tamagui'
import { IconButton } from './IconButton'

const _Overlay = styled(Stack, {
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
const _ModalContent = styled(Stack, {
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
export function Modal({ open, onOpenChange, title, children }) {
  return _jsx(Dialog, {
    modal: true,
    open: open,
    onOpenChange: onOpenChange,
    children: _jsxs(Dialog.Portal, {
      children: [
        _jsx(
          Dialog.Overlay,
          { animation: 'quick', opacity: 0.5, enterStyle: { opacity: 0 }, exitStyle: { opacity: 0 } },
          'overlay'
        ),
        _jsxs(
          Dialog.Content,
          {
            bordered: true,
            elevate: true,
            animation: [
              'medium',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ],
            enterStyle: { x: 0, y: -20, opacity: 0, scale: 0.9 },
            exitStyle: { x: 0, y: 10, opacity: 0, scale: 0.95 },
            width: '100%',
            maxWidth: 420,
            padding: '$4',
            borderRadius: '$4',
            children: [
              title &&
                _jsxs(ModalHeader, {
                  children: [
                    _jsx(Dialog.Title, { children: _jsx(ModalTitle, { children: title }) }),
                    _jsx(Dialog.Close, {
                      asChild: true,
                      children: _jsx(IconButton, { size: 'sm', variant: 'default', children: _jsx(X, { size: 16 }) }),
                    }),
                  ],
                }),
              children,
            ],
          },
          'content'
        ),
      ],
    }),
  })
}
