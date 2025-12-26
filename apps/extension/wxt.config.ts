import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Lux Exchange',
    description: 'Swap tokens on Lux Network directly from your browser',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['https://*.lux.network/*', 'https://*.zoo.network/*'],
  },
})
