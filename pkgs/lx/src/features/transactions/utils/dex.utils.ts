export function isLxSwapOrderPending(_tx: { status?: string }): boolean {
  return _tx?.status === 'pending'
}
