import { PartialMessage } from '@bufbuild/protobuf'
import { ConnectError } from '@connectrpc/connect'
import { useQuery } from '@connectrpc/connect-query'
import { UseQueryResult } from '@tanstack/react-query'
import { ProtocolStatsRequest, ProtocolStatsResponse } from '@luxamm/client-explore/dist/lx/explore/v1/service_pb'
import { protocolStats } from '@luxamm/client-explore/dist/lx/explore/v1/service-ExploreStatsService_connectquery'
import { lxGetTransport } from 'lx/src/data/rest/base'

/**
 * Wrapper around Tanstack useQuery for the Lx REST BE service ProtocolStats
 * This includes data for protocol TVL and volume graphs
 * @param input { chainId: string } - string representation of the chain to query or `ALL_NETWORKS` for aggregated data
 * @returns UseQueryResult<ProtocolStatsResponse, ConnectError>
 */
export function useProtocolStatsQuery(
  input?: PartialMessage<ProtocolStatsRequest>,
): UseQueryResult<ProtocolStatsResponse, ConnectError> {
  return useQuery(protocolStats, input, { transport: lxGetTransport })
}
