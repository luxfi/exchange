import '@reach/dialog/styles.css'
import '../src/global.css'
import '../src/polyfills'
import type { Preview } from '@storybook/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { ReactRouterUrlProvider } from '@l.x/lx/src/contexts/UrlContext'
import { GuiProvider } from '../src/theme/guiProvider'
import store from '~/state'

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
