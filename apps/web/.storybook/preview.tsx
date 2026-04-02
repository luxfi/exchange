import type { Preview } from '@storybook/react'
import { Provider } from 'react-redux'
import { ReactRouterUrlProvider } from '@l.x/lx/src/contexts/UrlContext'
import store from '~/state'
import { GuiProvider } from '../src/theme/guiProvider'

import '@reach/dialog/styles.css'
import { MemoryRouter } from 'react-router'
import '../src/global.css'
import '../src/polyfills'

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ReactRouterUrlProvider>
          <Provider store={store}>
            <GuiProvider>
              {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
              <Story />
            </GuiProvider>
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
