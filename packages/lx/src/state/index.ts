import { luxReducer } from 'lx/src/state/luxReducer'

// Utility type to be used inside the lux shared package
// Apps and packages should re-define those with a more specific `AppState`
export type LuxRootState = ReturnType<typeof luxReducer>
