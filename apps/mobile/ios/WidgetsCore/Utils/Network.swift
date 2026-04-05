//
//  Network.swift
//  WidgetsCore
//
//  Created by Eric Huang on 7/6/23.
//

import Foundation
import Apollo

public class Network {
  public static let shared = Network()
  
<<<<<<< HEAD
  private let LUX_API_URL = "https://ios.wallet.gateway.lux.exchange/v1/graphql"
=======
  private let UNISWAP_API_URL = "https://ios.wallet.gateway.uniswap.org/v1/graphql"
>>>>>>> upstream/main
  
  public lazy var apollo: ApolloClient = {
    let cache = InMemoryNormalizedCache()
    let store = ApolloStore(cache: cache)
    let client = URLSessionClient()
    
    let provider = NetworkInterceptorProvider(store: store, client: client)
<<<<<<< HEAD
    let url = URL(string: LUX_API_URL)!
=======
    let url = URL(string: UNISWAP_API_URL)!
>>>>>>> upstream/main
    let transport = RequestChainNetworkTransport(interceptorProvider: provider, endpointURL: url)
    return ApolloClient(networkTransport: transport, store: store)
  }()
}

class NetworkInterceptorProvider: InterceptorProvider {
    private let store: ApolloStore
    private let client: URLSessionClient
    
    init(store: ApolloStore, client: URLSessionClient) {
        self.store = store
        self.client = client
    }
    
    func interceptors<Operation: GraphQLOperation>(for operation: Operation) -> [ApolloInterceptor] {
        return [
            AuthorizationInterceptor(),
            MaxRetryInterceptor(),
            CacheReadInterceptor(store: self.store),
            NetworkFetchInterceptor(client: self.client),
            ResponseCodeInterceptor(),
            MultipartResponseParsingInterceptor(),
            JSONResponseParsingInterceptor(),
            AutomaticPersistedQueryInterceptor(),
            CacheWriteInterceptor(store: self.store)
        ]
    }
}

class AuthorizationInterceptor: ApolloInterceptor {

  
  func interceptAsync<Operation>(
    chain: RequestChain,
    request: HTTPRequest<Operation>,
    response: HTTPResponse<Operation>?,
    completion: @escaping (Result<GraphQLResult<Operation.Data>, Error>) -> Void
  ) where Operation : GraphQLOperation {
<<<<<<< HEAD
    request.addHeader(name: "X-API-KEY", value: Env.LUX_API_KEY)
    request.addHeader(name: "Content-Type", value: "application/json")
    request.addHeader(name: "Origin", value: "https://app.lux.exchange")
=======
    request.addHeader(name: "X-API-KEY", value: Env.UNISWAP_API_KEY)
    request.addHeader(name: "Content-Type", value: "application/json")
    request.addHeader(name: "Origin", value: "https://app.uniswap.org")
>>>>>>> upstream/main
    
    chain.proceedAsync(request: request,
                       response: response,
                       completion: completion)
  }
  
}
