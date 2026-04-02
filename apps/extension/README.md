# Lux Extension

## Developer Quickstart

### Environment variables

Before running the extension, you need to get the environment variables from 1password in order to get full functionality. Run the command `bun extension env:local:download` to copy them to your root folder.

### Running the extension locally

First, install dependencies from the top level of the monorepo:

```bash
bun install
```

```bash
bun extension dev
```

WXT automatically opens a browser window with the extension loaded.

##### Configuring WXT browser behavior

To customize the browser WXT opens, create a file `web-ext.config.ts` in this directory:

```ts
// web-ext.config.ts
import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
  // Option 1: Connect to already running Chrome (requires Chrome to be started with --remote-debugging-port=9222)
  // chromiumPort: 9222,

  // Option 2: Use your existing Chrome profile (but Chrome must be closed first)
  // chromiumArgs: [
  //   '--user-data-dir=/Users/<username>/Library/Application Support/Google/Chrome',
  //   '--profile-directory=Default'
  // ],

  // Option 3: Create a persistent profile that matches your existing setup (recommended)
  chromiumArgs: [
    '--user-data-dir=./.wxt/chrome-data',
    // Sync with your Google account to get bookmarks, extensions, etc.
    // '--enable-sync',
  ],
});
```

##### Running with absolute paths (for Scantastic testing)

Our Scantastic API requires a consistent origin header, so the build must be loaded from an absolute path. Chrome generates a consistent extension ID based on the path it was loaded from.

```bash
# Mac
bun extension start:absolute

# Windows
bun extension start:absolute:windows
```

## Migrations

We use `redux-persist` to persist the Redux state between user sessions. Most of this state is shared between the mobile app and the extension. Please review the [Wallet Migrations README](../../pkgs/wallet/src/state//README.md) for details on how to write migrations when you add or remove anything from the Redux state structure.
