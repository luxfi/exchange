import { ApolloLink } from '@apollo/client'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

// Typed as ApolloLink to avoid platform import issues for this function
// Callers only require A
export const getDatadogApolloLink = (): ApolloLink => {
  throw new PlatformSplitStubError('getDatadogApolloLink')
}
