import { NavigateToNftItemArgs } from '@l.x/lx/src/contexts/LuxContext'
import { getNftExplorerLink, openUri } from '@l.x/lx/src/utils/linking'
import { useEvent } from '@l.x/utils/src/react/hooks'

export function useNavigateToNftExplorerLink(): (args: NavigateToNftItemArgs) => void {
  return useEvent((args: NavigateToNftItemArgs): Promise<void> => openUri({ uri: getNftExplorerLink(args) }))
}
