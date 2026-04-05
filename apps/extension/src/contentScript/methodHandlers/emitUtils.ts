export function emitChainChanged(newChainId: string): void {
<<<<<<< HEAD
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
  // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
  window?.postMessage({
    emitKey: 'chainChanged',
    emitValue: newChainId,
  })
}
export function emitAccountsChanged(newConnectedAddresses: Address[]): void {
<<<<<<< HEAD
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
  // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
  window?.postMessage({
    emitKey: 'accountsChanged',
    emitValue: newConnectedAddresses,
  })
}
