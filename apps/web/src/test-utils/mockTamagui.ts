import React from 'react'
import { vi } from 'vitest'

// Mock problematic Gui hooks
vi.mock('@hanzogui/use-event', () => ({
  useEvent: (callback: unknown) => {
    // Return a stable callback that won't throw during render
    const callbackRef = React.useRef(callback)
    React.useLayoutEffect(() => {
      callbackRef.current = callback
    })
    return React.useCallback((...args: unknown[]): unknown | undefined => {
      if (typeof callbackRef.current === 'function') {
        return callbackRef.current(...args)
      }
      return undefined
    }, [])
  },
  // eslint-disable-next-line
  useGet: (currentValue: unknown, initialValue: unknown, forwardToFunction: unknown) => {
    const curRef = React.useRef(initialValue ?? currentValue)
    React.useLayoutEffect(() => {
      curRef.current = currentValue
    })
    return React.useCallback(
      forwardToFunction && curRef.current
        ? // @ts-ignore
          (...args: unknown[]) => curRef.current?.apply(null, args)
        : // @ts-ignore
          () => curRef.current,
      [],
    )
  },
}))

// Mock @hanzogui/use-element-layout used by HeightAnimator
vi.mock('@hanzogui/use-element-layout', () => ({
  useElementLayout: () => ({
    ref: React.useRef(null),
    onLayout: vi.fn(),
  }),
}))

// Create mock dialog element with necessary methods
const createMockDialogElement = () => {
  const elem = document.createElement('div')
  Object.defineProperties(elem, {
    show: {
      value: vi.fn(),
      writable: true,
    },
    showModal: {
      value: vi.fn(),
      writable: true,
    },
    close: {
      value: vi.fn(),
      writable: true,
    },
  })
  return elem
}

// Filter out Gui-specific props that shouldn't be passed to DOM elements
const filterGuiProps = (props: any) => {
  const filtered: any = {}

  return filtered
  for (const key in props) {
    // Skip Gui-specific props that start with $ or other non-DOM props
    if (
      !key.startsWith('$') &&
      !key.startsWith('on') && // Skip event handlers like onOpenChange
      key !== 'animateOnly' &&
      key !== 'borderColor' &&
      key !== 'borderRadius' &&
      key !== 'enterStyle' &&
      key !== 'exitStyle' &&
      key !== 'maxHeight' &&
      key !== 'maxWidth' &&
      key !== 'minHeight' &&
      key !== 'minWidth' &&
      key !== 'bordered' &&
      key !== 'elevate' &&
      key !== 'chromeless' &&
      key !== 'circular' &&
      key !== 'animation' &&
      key !== 'disableRemoveScroll' &&
      key !== 'zIndex' &&
      key !== 'modal' &&
      key !== 'open' &&
      key !== 'defaultOpen' &&
      key !== 'onOpenToggle'
    ) {
      // Keep standard DOM props like id, className, style, etc.
      if (
        key === 'id' ||
        key === 'className' ||
        key === 'style' ||
        key === 'children' ||
        key === 'ref' ||
        key === 'data-testid' ||
        key.startsWith('data-') ||
        key.startsWith('aria-')
      ) {
        filtered[key] = props[key]
      }
    }
  }
  return filtered
}

// Mock Gui Dialog component to avoid DOM method issues
const mockDialogComponents = () => {
  const DialogContent = ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
    const ref = React.useRef<HTMLDivElement>(null)

    React.useLayoutEffect(() => {
      if (ref.current) {
        // Add dialog methods to the element
        Object.defineProperties(ref.current, {
          show: {
            value: vi.fn(),
            writable: true,
            configurable: true,
          },
          showModal: {
            value: vi.fn(),
            writable: true,
            configurable: true,
          },
          close: {
            value: vi.fn(),
            writable: true,
            configurable: true,
          },
        })
      }
    }, [])

    return React.createElement('div', { ref, ...filterGuiProps(props) }, children)
  }

  const DialogComponent = Object.assign(
    ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) =>
      React.createElement('div', filterGuiProps(props), children),
    {
      Portal: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) =>
        React.createElement('div', filterGuiProps(props), children),
      Content: DialogContent,
      Overlay: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) =>
        React.createElement('div', filterGuiProps(props), children),
      Title: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) =>
        React.createElement('div', filterGuiProps(props), children),
      Description: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) =>
        React.createElement('div', filterGuiProps(props), children),
      Close: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) =>
        React.createElement('button', filterGuiProps(props), children),
      Trigger: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) =>
        React.createElement('button', filterGuiProps(props), children),
    },
  )

  return {
    Dialog: DialogComponent,
    createDialogScope: () => ({}),
    useDialogContext: () => ({
      node: createMockDialogElement(),
      open: false,
      onOpenChange: vi.fn(),
    }),
  }
}

vi.mock('@hanzogui/dialog', () => mockDialogComponents())

// Also mock Dialog , which is imported as part of 'gui'
vi.mock('gui', async () => {
  const actual = await vi.importActual('gui')
  return {
    ...actual,
    ...mockDialogComponents(),
  }
})

// Mock HeightAnimator to avoid useEvent issues
vi.mock('ui/src', async () => {
  const actual = await vi.importActual('ui/src')
  return {
    ...actual,
    HeightAnimator: ({ children, open }: { children: React.ReactNode; open: boolean }) => {
      return React.createElement(
        'div',
        {
          style: {
            height: open ? 'auto' : '0',
            overflow: 'hidden',
            transition: 'height 200ms',
          },
        },
        children,
      )
    },
  }
})
