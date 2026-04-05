<<<<<<< HEAD
import { NonfungiblePositionManager } from '@luxamm/v3-sdk'
=======
import { NonfungiblePositionManager } from '@uniswap/v3-sdk'
>>>>>>> upstream/main
import {
  NFPMCommand,
  NfpmCommandSchema,
  NonfungiblePositionManagerCall,
  NonfungiblePositionManagerCallSchema,
} from 'src/app/features/dappRequests/types/NonfungiblePositionManagerTypes'

const NFPMIface = NonfungiblePositionManager.INTERFACE

function parseMulticallCommand(calldata: string): NFPMCommand {
  const txDescription = NFPMIface.parseTransaction({ data: calldata })

  return NfpmCommandSchema.parse({
    commandName: txDescription.name,
    params: txDescription.args['params'],
  })
}

export function parseCalldata(calldata: string): NonfungiblePositionManagerCall {
  const txDescription = NFPMIface.parseTransaction({ data: calldata })
  const { data } = txDescription.args
  if (txDescription.name === 'multicall') {
    return NonfungiblePositionManagerCallSchema.parse({ commands: data.map(parseMulticallCommand) })
  }

<<<<<<< HEAD
  throw new Error('All NFPM calls from the Lux Labs interface are multicalls.')
=======
  throw new Error('All NFPM calls from the Uniswap Labs interface are multicalls.')
>>>>>>> upstream/main
}
