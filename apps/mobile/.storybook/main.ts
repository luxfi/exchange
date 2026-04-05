import type { StorybookConfig } from '@storybook/react-native'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.?(ts|tsx|js|jsx)',
<<<<<<< HEAD
    '../../../pkgs/ui/src/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../pkgs/lx/src/**/*.stories.?(ts|tsx|js|jsx)',
=======
    '../../../packages/ui/src/**/*.stories.?(ts|tsx|js|jsx)',
    '../../../packages/uniswap/src/**/*.stories.?(ts|tsx|js|jsx)',
>>>>>>> upstream/main
  ],
  addons: ['@storybook/addon-ondevice-controls'],
}

export default config
