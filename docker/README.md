# LX Exchange - Docker Backend

Complete backend infrastructure for local development with luxd nodes and LXD gateway.

## Quick Start

```bash
# Start mainnet backend (luxd + LXD gateway)
docker compose up -d

# Start with testnet support
docker compose --profile testnet up -d

# Full stack (backend + exchange UI)
docker compose --profile full up -d
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| luxd-mainnet | 9630 | Lux mainnet node (Chain ID: 96369) |
| luxd-testnet | 9640 | Lux testnet node (Chain ID: 96368) |
| lxd-gateway | 8080 | DEX API for mainnet |
| lxd-gateway-testnet | 8081 | DEX API for testnet |
| redis | 6379 | Cache layer |
| exchange | 9000 | Web UI (with --profile full) |

## RPC Endpoints

### Mainnet (Chain ID: 96369)
```
C-Chain RPC: http://localhost:9630/ext/bc/C/rpc
Zoo RPC:     http://localhost:9630/ext/bc/Zoo/rpc
P-Chain:    http://localhost:9630/ext/bc/P
X-Chain:    http://localhost:9630/ext/bc/X
```

### Testnet (Chain ID: 96368)
```
C-Chain RPC: http://localhost:9640/ext/bc/C/rpc
Zoo RPC:     http://localhost:9640/ext/bc/Zoo/rpc
```

## LXD Gateway API

The LXD Gateway provides REST endpoints for DEX operations:

```bash
# Health check
curl http://localhost:8080/health

# Get tokens for chain
curl http://localhost:8080/v1/tokens?chainId=96369

# Get token stats (price, volume, etc.)
curl http://localhost:8080/v1/tokens/stats?chainId=96369

# Get pools
curl http://localhost:8080/v1/pools?chainId=96369

# Get swap quote
curl "http://localhost:8080/v1/quote?chainId=96369&tokenIn=0x...&tokenOut=0x...&amountIn=1000000000000000000"

# Execute swap (POST)
curl -X POST http://localhost:8080/v1/swap \
  -H "Content-Type: application/json" \
  -d '{"chainId":96369,"tokenIn":"0x...","tokenOut":"0x...","amountIn":"1000000000000000000"}'
```

## Environment Variables

Create a `.env` file to customize:

```bash
# Ports
MAINNET_RPC_PORT=9630
TESTNET_RPC_PORT=9640
LXD_MAINNET_PORT=8080
LXD_TESTNET_PORT=8081
EXCHANGE_PORT=9000

# Logging
LOG_LEVEL=info
```

## Using with Universe

For a full 5-node validator network, use the universe stack:

```bash
# From ~/work/lux/universe
docker compose up -d                    # 5 mainnet validators
docker compose --profile ui up -d       # Add UIs including LXD gateway
```

Then configure the exchange to use universe:

```bash
# In exchange .env
NEXT_PUBLIC_LXD_GATEWAY_URL=http://localhost:8080
NEXT_PUBLIC_LUX_MAINNET_RPC=http://localhost:9630/ext/bc/C/rpc
```

## Chain IDs

| Chain | Mainnet | Testnet |
|-------|---------|---------|
| Lux C-Chain | 96369 | 96368 |
| Zoo | 200200 | 200201 |
| Hanzo | 36963 | 36962 |

## DEX Precompile

The V4-style DEX is implemented as EVM precompiles using the Lux prefix address format:

**Lux Precompile Address Standard:**
- Prefix format: `0xNNNN000000000000000000000000000000000000`
- Range `0x0400-0x04FF` is reserved for DEX precompiles

| Contract | Address |
|----------|---------|
| PoolManager | `0x0400000000000000000000000000000000000000` |
| SwapRouter | `0x0401000000000000000000000000000000000000` |
| HooksRegistry | `0x0402000000000000000000000000000000000000` |
| FlashLoan | `0x0403000000000000000000000000000000000000` |
| Lending | `0x0410000000000000000000000000000000000000` |
| Liquid | `0x0430000000000000000000000000000000000000` |
| Teleport | `0x0440000000000000000000000000000000000000` |

## Troubleshooting

### Node won't sync
```bash
# Check node health
curl http://localhost:9630/ext/health

# View logs
docker compose logs -f luxd-mainnet
```

### LXD Gateway not responding
```bash
# Check gateway health
curl http://localhost:8080/health

# View logs
docker compose logs -f lxd-gateway
```

### Reset everything
```bash
docker compose down -v
docker compose up -d
```
