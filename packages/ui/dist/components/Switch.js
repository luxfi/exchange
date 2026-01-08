import { jsx as _jsx } from 'react/jsx-runtime'
import { Switch as TSwitch } from 'tamagui'
export function Switch({ size = 'md', ...props }) {
  const sizeMap = {
    sm: '$2',
    md: '$3',
    lg: '$4',
  }
  return _jsx(TSwitch, { size: sizeMap[size], ...props, children: _jsx(TSwitch.Thumb, { animation: 'quick' }) })
}
