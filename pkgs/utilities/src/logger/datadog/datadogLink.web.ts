import { ApolloLink } from '@apollo/client'
import { datadogRum } from '@datadog/browser-rum'
import { getOperationName, getOperationType } from '@l.x/utils/src/logger/datadog/datadogLinkUtils'

const DATADOG_CUSTOM_HEADER_PREFIX = '_dd-custom-header'
const DATADOG_GRAPH_QL_OPERATION_NAME_HEADER = `${DATADOG_CUSTOM_HEADER_PREFIX}-graph-ql-operation-name`
const DATADOG_GRAPH_QL_OPERATION_TYPE_HEADER = `${DATADOG_CUSTOM_HEADER_PREFIX}-graph-ql-operation-type`

export const getDatadogApolloLink = (): ApolloLink => {
  return new DatadogLink()
}

/**
 * Web implementation of DatadogLink for Apollo Client that adds operation tracking headers
 * and integrates with browser RUM.
 */
class DatadogLink extends ApolloLink {
  constructor() {
    super((operation, forward) => {
      // Skip header injection when Datadog RUM isn't initialized.
      // White-label deploys without Datadog (e.g. Liquidity) point Apollo at
      // a graphql server whose CORS only allows Content-Type. Injecting
      // _dd-custom-header-* headers there causes the preflight to fail and
      // every query 0-bytes out before reaching the server.
      // datadogRum.getInternalContext() returns undefined until init() runs.
      if (!datadogRum.getInternalContext()) {
        return forward(operation)
      }

      const operationName = getOperationName(operation)
      const operationType = getOperationType(operation)

      operation.setContext(({ headers = {} }) => {
        const newHeaders: Record<string, string | null> = {
          ...headers,
        }

        newHeaders[DATADOG_GRAPH_QL_OPERATION_TYPE_HEADER] = operationType
        newHeaders[DATADOG_GRAPH_QL_OPERATION_NAME_HEADER] = operationName

        return {
          headers: newHeaders,
        }
      })

      datadogRum.addAction('graphql_operation', {
        operationType,
        operationName,
      })

      return forward(operation)
    })
  }
}
