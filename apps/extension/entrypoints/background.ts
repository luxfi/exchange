export default defineBackground(() => {
  console.log('Lux Exchange extension loaded')

  // Listen for messages from popup or content scripts
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_ACCOUNT') {
      // Handle account request
      sendResponse({ account: null })
    }
    return true
  })
})
