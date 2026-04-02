import type { StorybookConfig } from '@storybook/react-native'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../pkgs/ui/src/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../pkgs/lx/src/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: ['@storybook/addon-ondevice-controls'],
}

export default config
