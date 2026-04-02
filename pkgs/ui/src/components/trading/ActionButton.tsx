import { Button, type ButtonProps } from '@hanzo/gui'

export type ActionButtonProps = ButtonProps & {
  variant?: 'primary' | 'secondary' | 'critical'
}

export function ActionButton({ variant = 'primary', ...props }: ActionButtonProps) {
  return <Button {...props} />
}
