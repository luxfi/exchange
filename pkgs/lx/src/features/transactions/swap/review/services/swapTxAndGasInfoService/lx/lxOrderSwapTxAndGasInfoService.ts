// LX order swap service — delegates to classic for execution + gas, with
// the same ctx (gasStrategy / transactionSettings / instructionService) the
// other service factories receive. Fixes a no-args invocation crash at the
// consumer site (hooks.ts) that bubbled into React error #185.
export { createClassicSwapTxAndGasInfoService as createLXSwapTxAndGasInfoService } from '@l.x/lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/classic/classicSwapTxAndGasInfoService'
