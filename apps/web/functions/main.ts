// Cloudflare Workers entry point
import { createApp, ENTRY_GATEWAY_URLS, WEBSOCKET_URLS } from 'functions/app'

const app = createApp({
  fetchSpaHtml: (c) => c.env.ASSETS.fetch(c.req.raw),
  getEntryGatewayUrl: (c) => c.env?.ENTRY_GATEWAY_API_URL || ENTRY_GATEWAY_URLS.production,
  getWebSocketUrl: (c) => c.env?.WEBSOCKET_URL || WEBSOCKET_URLS.production,
  getTrustedClientIp: (c) => c.req.header('cf-connecting-ip'),
})

<<<<<<< HEAD
// eslint-disable-next-line import/no-unused-modules
=======
// oxlint-disable-next-line import/no-unused-modules
>>>>>>> upstream/main
export default app
