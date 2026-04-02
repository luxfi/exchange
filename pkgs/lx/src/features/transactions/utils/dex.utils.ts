export function isLXOrderPending(_tx: { status?: string }): boolean {
  return _tx?.status === 'pending'
}
