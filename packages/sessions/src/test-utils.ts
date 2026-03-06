/** biome-ignore-all lint/suspicious/noExplicitAny: mock handlers */
import type { PartialMessage } from '@bufbuild/protobuf'
import type { CallOptions } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import {
  type ChallengeRequest,
  type ChallengeResponse,
  type GetChallengeTypesRequest,
  type GetChallengeTypesResponse,
  type InitSessionRequest,
  type InitSessionResponse,
  type IntrospectSessionRequest,
  type IntrospectSessionResponse,
  type SignoutRequest,
  type SignoutResponse,
  type UpdateSessionRequest,
  type UpdateSessionResponse,
  type VerifyRequest,
  type VerifyResponse,
} from '@luxdex/client-platform-service/dist/uniswap/platformservice/v1/sessionService_pb'
import type { DeviceIdService } from '@luxfi/sessions/src/device-id/types'
import type { SessionServiceClient } from '@luxfi/sessions/src/session-repository/createSessionClient'
import type { SessionState, SessionStorage } from '@luxfi/sessions/src/session-storage/types'
import type { LuxIdentifierService } from '@luxfi/sessions/src/lux-identifier/types'
// Types for our test transport
export interface MockEndpointHandler {
  (request: any, headers: Record<string, string>): Promise<any>
}

export interface MockEndpoints {
  '/lux.platformservice.v1.SessionService/InitSession': MockEndpointHandler
  '/lux.platformservice.v1.SessionService/Challenge': MockEndpointHandler
  '/lux.platformservice.v1.SessionService/Verify': MockEndpointHandler
  '/lux.platformservice.v1.SessionService/IntrospectSession': MockEndpointHandler
  '/lux.platformservice.v1.SessionService/UpdateSession': MockEndpointHandler
  '/lux.platformservice.v1.SessionService/GetChallengeTypes': MockEndpointHandler
  '/lux.platformservice.v1.SessionService/Signout': MockEndpointHandler
}

// Test transport that intercepts requests and returns mock responses
export function createTestTransport(mockEndpoints: MockEndpoints): ReturnType<typeof createConnectTransport> {
  return createConnectTransport({
    baseUrl: 'https://test.api.lux.org',
    interceptors: [
      (_next) => async (request) => {
        const url = request.url
        const path = new URL(url).pathname
        const handler = mockEndpoints[path as keyof MockEndpoints]

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!handler) {
          throw new Error(`No mock handler for ${path}`)
        }

        // Extract headers
        const headers: Record<string, string> = {}
        request.header.forEach((value, key) => {
          headers[key] = value
        })

        const requestData = request.message

        const responseData = await handler(requestData, headers)

        // Return properly typed response
        return {
          stream: false as const,
          service: request.service,
          method: request.method,
          header: new Headers(),
          message: responseData,
          trailer: new Headers(),
        }
      },
    ],
  })
}

// In-memory storage implementations
export class InMemorySessionStorage implements SessionStorage {
  private state: SessionState | null = null

  async get(): Promise<SessionState | null> {
    return this.state
  }

  async set(session: SessionState): Promise<void> {
    this.state = session
  }

  async clear(): Promise<void> {
    this.state = null
  }
}

export class InMemoryDeviceIdService implements DeviceIdService {
  private deviceId: string | null = null

  async getDeviceId(): Promise<string | null> {
    return this.deviceId
  }

  async setDeviceId(id: string): Promise<void> {
    this.deviceId = id
  }

  async removeDeviceId(): Promise<void> {
    this.deviceId = null
  }
}

export class InMemoryLuxIdentifierService implements LuxIdentifierService {
  private identifier: string | null = null

  async getLuxIdentifier(): Promise<string | null> {
    return this.identifier
  }

  async setLuxIdentifier(id: string): Promise<void> {
    this.identifier = id
  }

  async removeLuxIdentifier(): Promise<void> {
    this.identifier = null
  }
}

// Create a mock session client for testing
// eslint-disable-next-line max-params
export function createMockSessionClient(
  mockEndpoints: MockEndpoints,
  sessionStorage: SessionStorage,
  deviceIdService: DeviceIdService,
): SessionServiceClient {
  return {
    initSession: async (
      request: PartialMessage<InitSessionRequest>,
      _options?: CallOptions,
    ): Promise<InitSessionResponse> => {
      const response = await mockEndpoints['/lux.platformservice.v1.SessionService/InitSession'](request, {})
      return response as InitSessionResponse
    },
    challenge: async (
      request: PartialMessage<ChallengeRequest>,
      _options?: CallOptions,
    ): Promise<ChallengeResponse> => {
      const sessionId = await sessionStorage.get()
      const deviceId = await deviceIdService.getDeviceId()
      const headers: Record<string, string> = {}
      if (sessionId?.sessionId) {
        headers['X-Session-ID'] = sessionId.sessionId
      }
      if (deviceId) {
        headers['X-Device-ID'] = deviceId
      }

      const response = await mockEndpoints['/lux.platformservice.v1.SessionService/Challenge'](request, headers)
      return response as ChallengeResponse
    },
    verify: async (request: PartialMessage<VerifyRequest>, _options?: CallOptions): Promise<VerifyResponse> => {
      const sessionId = await sessionStorage.get()
      const deviceId = await deviceIdService.getDeviceId()
      const headers: Record<string, string> = {}
      if (sessionId?.sessionId) {
        headers['X-Session-ID'] = sessionId.sessionId
      }
      if (deviceId) {
        headers['X-Device-ID'] = deviceId
      }

      const response = await mockEndpoints['/lux.platformservice.v1.SessionService/Verify'](request, headers)
      return response as VerifyResponse
    },
    introspectSession: async (
      request: PartialMessage<IntrospectSessionRequest>,
      _options?: CallOptions,
    ): Promise<IntrospectSessionResponse> => {
      const response = await mockEndpoints['/lux.platformservice.v1.SessionService/IntrospectSession'](request, {})
      return response as IntrospectSessionResponse
    },
    updateSession: async (
      request: PartialMessage<UpdateSessionRequest>,
      _options?: CallOptions,
    ): Promise<UpdateSessionResponse> => {
      const response = await mockEndpoints['/lux.platformservice.v1.SessionService/UpdateSession'](request, {})
      return response as UpdateSessionResponse
    },
    getChallengeTypes: async (
      request: PartialMessage<GetChallengeTypesRequest>,
      _options?: CallOptions,
    ): Promise<GetChallengeTypesResponse> => {
      const response = await mockEndpoints['/lux.platformservice.v1.SessionService/GetChallengeTypes'](request, {})
      return response as GetChallengeTypesResponse
    },
    signout: async (request: PartialMessage<SignoutRequest>, _options?: CallOptions): Promise<SignoutResponse> => {
      const response = await mockEndpoints['/lux.platformservice.v1.SessionService/Signout'](request, {})
      return response as SignoutResponse
    },
  }
}
