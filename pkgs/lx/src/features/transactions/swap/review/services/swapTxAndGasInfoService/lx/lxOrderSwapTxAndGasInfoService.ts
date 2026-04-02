import { createClassicSwapTxAndGasInfoService } from '../classic/classicSwapTxAndGasInfoService'

// LX order swap service — delegates to classic swap for now
// TODO: implement LX-specific order flow when LX order protocol is deployed
export const createLXSwapTxAndGasInfoService = createClassicSwapTxAndGasInfoService
