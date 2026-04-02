#!/usr/bin/env bash
#
# Lux Exchange - Contract Deployment Script
#
# Deploys AMM contracts to local/testnet using Foundry forge.
# Uses the standard contracts from /Users/z/work/lux/standard
#
# Usage:
#   ./scripts/deploy-contracts.sh                    # Deploy to local
#   ./scripts/deploy-contracts.sh --network testnet  # Deploy to testnet
#   ./scripts/deploy-contracts.sh --liquidity        # Add initial liquidity
#
# Environment:
#   PRIVATE_KEY          - Deployer private key (uses default test key if not set)
#   RPC_URL              - RPC endpoint (defaults to local node)
#   STANDARD_DIR         - Path to standard contracts

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
STANDARD_DIR="${STANDARD_DIR:-/Users/z/work/lux/standard}"
DEPLOYMENTS_FILE="$PROJECT_DIR/.local-deployments.json"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default configuration
NETWORK="${NETWORK:-local}"
ADD_LIQUIDITY=false

# Network RPC URLs
LOCAL_RPC="http://localhost:9650/ext/bc/C/rpc"
TESTNET_RPC="https://api.lux-test.network/rpc"
MAINNET_RPC="https://api.lux.network/rpc"

# Test account (Anvil default #0) - NEVER use on mainnet!
DEFAULT_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --network)
            NETWORK="$2"
            shift 2
            ;;
        --liquidity)
            ADD_LIQUIDITY=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --network <name>   Network to deploy to (local, testnet, mainnet)"
            echo "  --liquidity        Add initial liquidity after deployment"
            echo "  -h, --help         Show this help"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Set RPC URL based on network
case $NETWORK in
    local)
        RPC_URL="${RPC_URL:-$LOCAL_RPC}"
        PRIVATE_KEY="${PRIVATE_KEY:-$DEFAULT_PRIVATE_KEY}"
        CHAIN_ID=31337
        ;;
    testnet)
        RPC_URL="${RPC_URL:-$TESTNET_RPC}"
        if [ -z "${PRIVATE_KEY:-}" ]; then
            log_error "PRIVATE_KEY must be set for testnet deployment"
            exit 1
        fi
        CHAIN_ID=96368
        ;;
    mainnet)
        RPC_URL="${RPC_URL:-$MAINNET_RPC}"
        if [ -z "${PRIVATE_KEY:-}" ]; then
            log_error "PRIVATE_KEY must be set for mainnet deployment"
            exit 1
        fi
        CHAIN_ID=96369
        log_warn "Deploying to MAINNET - are you sure?"
        read -p "Type 'yes' to continue: " confirm
        if [ "$confirm" != "yes" ]; then
            log_info "Deployment cancelled"
            exit 0
        fi
        ;;
    *)
        log_error "Unknown network: $NETWORK"
        exit 1
        ;;
esac

# Check requirements
check_requirements() {
    log_info "Checking requirements..."

    if ! command -v forge &> /dev/null; then
        log_error "Foundry (forge) is required. Install: curl -L https://foundry.paradigm.xyz | bash && foundryup"
        exit 1
    fi

    if ! command -v cast &> /dev/null; then
        log_error "Foundry (cast) is required. Install: curl -L https://foundry.paradigm.xyz | bash && foundryup"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        log_error "jq is required. Install: brew install jq"
        exit 1
    fi

    if [ ! -d "$STANDARD_DIR" ]; then
        log_error "Standard contracts not found at: $STANDARD_DIR"
        exit 1
    fi

    log_success "Requirements satisfied"
}

# Verify RPC connection
verify_rpc() {
    log_info "Verifying RPC connection to $RPC_URL..."

    local result
    result=$(curl -sf -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
        "$RPC_URL" 2>/dev/null || echo "")

    if [ -z "$result" ]; then
        log_error "Cannot connect to RPC at $RPC_URL"
        exit 1
    fi

    local chain_id
    chain_id=$(echo "$result" | jq -r '.result')
    log_success "Connected to chain: $chain_id"
}

# Get deployer address
get_deployer_address() {
    DEPLOYER_ADDRESS=$(cast wallet address --private-key "$PRIVATE_KEY")
    log_info "Deployer address: $DEPLOYER_ADDRESS"
}

# Check deployer balance
check_balance() {
    log_info "Checking deployer balance..."

    local balance
    balance=$(cast balance "$DEPLOYER_ADDRESS" --rpc-url "$RPC_URL" 2>/dev/null || echo "0")

    if [ "$balance" = "0" ]; then
        log_error "Deployer account has no balance"
        if [ "$NETWORK" = "local" ]; then
            log_info "For local testing, ensure the node has genesis allocations for the test account"
        fi
        exit 1
    fi

    log_success "Deployer balance: $balance wei"
}

# Deploy a single contract and return address
deploy_contract() {
    local name="$1"
    local args="${2:-}"

    log_info "Deploying $name..."

    local output
    if [ -n "$args" ]; then
        output=$(forge create "$name" \
            --rpc-url "$RPC_URL" \
            --private-key "$PRIVATE_KEY" \
            --json \
            --constructor-args $args 2>&1)
    else
        output=$(forge create "$name" \
            --rpc-url "$RPC_URL" \
            --private-key "$PRIVATE_KEY" \
            --json 2>&1)
    fi

    local address
    address=$(echo "$output" | jq -r '.deployedTo // empty')

    if [ -z "$address" ]; then
        log_error "Failed to deploy $name"
        echo "$output"
        exit 1
    fi

    log_success "$name deployed at: $address"
    echo "$address"
}

# Main deployment
deploy_all() {
    log_info "Starting deployment to $NETWORK network..."

    cd "$STANDARD_DIR"

    # Initialize deployments JSON
    local deployments='{}'

    # 1. Deploy WLUX (Wrapped LUX)
    log_info "=== Phase 1: Core Tokens ==="

    local wlux_address
    wlux_address=$(deploy_contract "contracts/tokens/WLUX.sol:WLUX")
    deployments=$(echo "$deployments" | jq --arg addr "$wlux_address" '. + {wlux: $addr}')

    # 2. Deploy LUSD (Lux USD stablecoin)
    local lusd_address
    lusd_address=$(deploy_contract "contracts/bridge/lux/LUSD.sol:LuxUSD")
    deployments=$(echo "$deployments" | jq --arg addr "$lusd_address" '. + {lusd: $addr}')

    # 3. Deploy WETH
    local weth_address
    weth_address=$(deploy_contract "contracts/bridge/WETH.sol:WETH")
    deployments=$(echo "$deployments" | jq --arg addr "$weth_address" '. + {weth: $addr}')

    # 4. Deploy AMM Factory
    log_info "=== Phase 2: AMM Infrastructure ==="

    local factory_address
    factory_address=$(deploy_contract "contracts/amm/LuxV2Factory.sol:LuxV2Factory" "$DEPLOYER_ADDRESS")
    deployments=$(echo "$deployments" | jq --arg addr "$factory_address" '. + {factory: $addr}')

    # 5. Deploy AMM Router
    local router_address
    router_address=$(deploy_contract "contracts/amm/LuxV2Router.sol:LuxV2Router" "$factory_address $wlux_address")
    deployments=$(echo "$deployments" | jq --arg addr "$router_address" '. + {router: $addr}')

    # 6. Deploy Multicall (useful for batched reads)
    log_info "=== Phase 3: Utilities ==="

    local multicall_address
    multicall_address=$(deploy_contract "contracts/multicall/Multicall2.sol:Multicall2")
    deployments=$(echo "$deployments" | jq --arg addr "$multicall_address" '. + {multicall: $addr}')

    # 7. Create initial pairs
    log_info "=== Phase 4: Create Pairs ==="

    # Create WLUX/LUSD pair
    log_info "Creating WLUX/LUSD pair..."
    local create_pair_result
    create_pair_result=$(cast send "$factory_address" \
        "createPair(address,address)(address)" \
        "$wlux_address" "$lusd_address" \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY" \
        --json 2>&1)

    # Get pair address
    local wlux_lusd_pair
    wlux_lusd_pair=$(cast call "$factory_address" \
        "getPair(address,address)(address)" \
        "$wlux_address" "$lusd_address" \
        --rpc-url "$RPC_URL" 2>/dev/null || echo "")

    if [ -n "$wlux_lusd_pair" ] && [ "$wlux_lusd_pair" != "0x0000000000000000000000000000000000000000" ]; then
        log_success "WLUX/LUSD pair: $wlux_lusd_pair"
        deployments=$(echo "$deployments" | jq --arg addr "$wlux_lusd_pair" '. + {wluxLusdPair: $addr}')
    fi

    # Create WLUX/WETH pair
    log_info "Creating WLUX/WETH pair..."
    cast send "$factory_address" \
        "createPair(address,address)(address)" \
        "$wlux_address" "$weth_address" \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY" \
        --json > /dev/null 2>&1 || true

    local wlux_weth_pair
    wlux_weth_pair=$(cast call "$factory_address" \
        "getPair(address,address)(address)" \
        "$wlux_address" "$weth_address" \
        --rpc-url "$RPC_URL" 2>/dev/null || echo "")

    if [ -n "$wlux_weth_pair" ] && [ "$wlux_weth_pair" != "0x0000000000000000000000000000000000000000" ]; then
        log_success "WLUX/WETH pair: $wlux_weth_pair"
        deployments=$(echo "$deployments" | jq --arg addr "$wlux_weth_pair" '. + {wluxWethPair: $addr}')
    fi

    # Add metadata
    deployments=$(echo "$deployments" | jq \
        --arg network "$NETWORK" \
        --arg chainId "$CHAIN_ID" \
        --arg deployer "$DEPLOYER_ADDRESS" \
        --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        '. + {network: $network, chainId: $chainId, deployer: $deployer, deployedAt: $timestamp}')

    # Save deployments
    echo "$deployments" | jq '.' > "$DEPLOYMENTS_FILE"
    log_success "Deployments saved to $DEPLOYMENTS_FILE"

    # Add liquidity if requested
    if $ADD_LIQUIDITY; then
        add_initial_liquidity "$wlux_address" "$lusd_address" "$weth_address" "$router_address"
    fi
}

# Add initial liquidity to pools
add_initial_liquidity() {
    local wlux="$1"
    local lusd="$2"
    local weth="$3"
    local router="$4"

    log_info "=== Phase 5: Add Initial Liquidity ==="

    # Mint some test tokens first
    log_info "Minting test tokens..."

    # Mint LUSD (assuming it has a mint function for testing)
    cast send "$lusd" "mint(address,uint256)" "$DEPLOYER_ADDRESS" "1000000000000000000000000" \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY" > /dev/null 2>&1 || log_warn "Could not mint LUSD (may need different method)"

    # Wrap some native LUX to WLUX
    log_info "Wrapping LUX to WLUX..."
    cast send "$wlux" "deposit()" \
        --value 1000000000000000000000 \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY" > /dev/null 2>&1 || log_warn "Could not wrap LUX"

    # Approve router
    log_info "Approving router..."
    local max_uint="115792089237316195423570985008687907853269984665640564039457584007913129639935"

    cast send "$wlux" "approve(address,uint256)" "$router" "$max_uint" \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY" > /dev/null 2>&1 || true

    cast send "$lusd" "approve(address,uint256)" "$router" "$max_uint" \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY" > /dev/null 2>&1 || true

    # Add liquidity
    log_info "Adding liquidity to WLUX/LUSD pool..."
    local deadline=$(($(date +%s) + 3600))

    cast send "$router" \
        "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)" \
        "$wlux" "$lusd" \
        "100000000000000000000" "100000000000000000000" \
        "0" "0" \
        "$DEPLOYER_ADDRESS" "$deadline" \
        --rpc-url "$RPC_URL" \
        --private-key "$PRIVATE_KEY" > /dev/null 2>&1 || log_warn "Could not add liquidity"

    log_success "Initial liquidity added"
}

# Print deployment summary
print_summary() {
    echo ""
    echo "=============================================="
    echo -e "${GREEN}Deployment Complete${NC}"
    echo "=============================================="
    echo ""
    echo "Network: $NETWORK (chainId: $CHAIN_ID)"
    echo "RPC:     $RPC_URL"
    echo ""

    if [ -f "$DEPLOYMENTS_FILE" ]; then
        echo "Contracts:"
        jq -r 'to_entries | .[] | select(.key | test("^(wlux|lusd|weth|factory|router|multicall)$")) | "  \(.key): \(.value)"' "$DEPLOYMENTS_FILE"
        echo ""
        echo "Pairs:"
        jq -r 'to_entries | .[] | select(.key | test("Pair$")) | "  \(.key): \(.value)"' "$DEPLOYMENTS_FILE"
    fi

    echo ""
    echo "Next steps:"
    echo "  1. Update .env.local with contract addresses"
    echo "  2. Run: pnpm dev"
    echo "  3. Run E2E tests: pnpm test:e2e"
    echo ""
}

# Main execution
main() {
    echo ""
    echo "=============================================="
    echo "  Lux Exchange - Contract Deployment"
    echo "=============================================="
    echo ""

    check_requirements
    verify_rpc
    get_deployer_address
    check_balance
    deploy_all
    print_summary
}

main
