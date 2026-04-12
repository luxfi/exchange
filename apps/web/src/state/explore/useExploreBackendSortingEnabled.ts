import { ExploreBackendSortingProperties, Layers, useExperimentValueFromLayer } from '@l.x/gating'

/**
 * Hook that returns whether backend sorting is enabled for the Explore page.
 */
export function useExploreBackendSortingEnabled(): boolean {
  return useExperimentValueFromLayer({
    layerName: Layers.ExplorePage,
    param: ExploreBackendSortingProperties.BackendSortingEnabled,
    defaultValue: false,
  })
}
