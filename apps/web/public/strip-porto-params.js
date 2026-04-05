// Strip porto.* URL params to prevent relay MITM (bug bounty #619).
// Porto's getDialogUrl() forwards these into the wallet dialog iframe URL
// without validation, allowing an attacker to inject params like relayUrl
// to hijack wallet RPC communication.
//
// IMPORTANT: This MUST be loaded as a non-module <script src> before the
// app's <script type="module"> entry point. ES module imports are hoisted
// and evaluated depth-first before module-level code runs, so placing this
// in sideEffects.ts would execute AFTER Porto's SDK is already imported
// (via wagmiAutoConnect -> wagmiConfig -> porto/wagmi). A separate script
// loaded via src (satisfying CSP 'self') guarantees execution before any
// ES module evaluation.
;(() => {
  const url = new URL(window.location.href);
  let stripped = false;
  const keys = Array.from(url.searchParams.keys());
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].indexOf('porto.') === 0) {
      url.searchParams.delete(keys[i]);
      stripped = true;
    }
  }
  if (stripped) {
    window.history.replaceState({}, '', url.toString());
  }
})();
