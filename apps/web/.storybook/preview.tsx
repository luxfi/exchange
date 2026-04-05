<<<<<<< HEAD
import type { Preview } from '@storybook/react'
import { Provider } from 'react-redux'
import { ReactRouterUrlProvider } from '@l.x/lx/src/contexts/UrlContext'
import store from '~/state'
import { GuiProvider } from '../src/theme/guiProvider'

import '@reach/dialog/styles.css'
import { MemoryRouter } from 'react-router'
import '../src/global.css'
import '../src/polyfills'
=======
import '@reach/dialog/styles.css'
import '../src/global.css'
import '../src/polyfills'
import type { Preview } from '@storybook/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { ReactRouterUrlProvider } from 'uniswap/src/contexts/UrlContext'
import { TamaguiProvider } from '../src/theme/tamaguiProvider'
import store from '~/state'
>>>>>>> upstream/main

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ReactRouterUrlProvider>
          <Provider store={store}>
<<<<<<< HEAD
            <GuiProvider>
              {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
              <Story />
            </GuiProvider>
=======
            <TamaguiProvider>
              {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
              <Story />
            </TamaguiProvider>
>>>>>>> upstream/main
          </Provider>
        </ReactRouterUrlProvider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
