import type { OverKeyboardContentProps } from '@luxfi/ui/src/components/OverKeyboardContent/OverKeyboardContent'

export function OverKeyboardContent({
  visible,
  children,
}: React.PropsWithChildren<OverKeyboardContentProps>): JSX.Element {
  return <>{visible && children}</>
}
