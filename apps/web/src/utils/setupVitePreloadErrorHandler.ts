export function setupVitePreloadErrorHandler(): void {
  window.addEventListener('vite:preloadError', (event: Event) => {
    // Prevent Vite from throwing the error and crashing the app
    event.preventDefault()

<<<<<<< HEAD
    // biome-ignore lint/suspicious/noConsole: Error handler needs console for debugging preload issues
=======
    // oxlint-disable-next-line no-console -- Error handler needs console for debugging preload issues
>>>>>>> upstream/main
    console.error('Vite preload error: Dynamic import failed to load')
  })
}
