import type { OverKeyboardContentProps } from '@l.x/ui/src/components/OverKeyboardContent/OverKeyboardContent'

export function OverKeyboardContent({
  visible,
  children,
}: React.PropsWithChildren<OverKeyboardContentProps>): JSX.Element {
  return <>{visible && children}</>
}
