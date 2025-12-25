#!/usr/bin/env bash
#
# Lux Exchange - Local Development Setup
#
# This script sets up a complete local testing environment:
# 1. Starts Docker services (node, postgres, redis)
# 2. Waits for node health
# 3. Deploys contracts using forge
# 4. Initializes liquidity pools
# 5. Configures exchange to use local endpoints
#
# Usage:
#   ./scripts/local-setup.sh              # Full setup
#   ./scripts/local-setup.sh --no-deploy  # Skip contract deployment
#   ./scripts/local-setup.sh --down       # Stop all services
#   ./scripts/local-setup.sh --reset      # Reset and start fresh
#
# Requirements:
#   - Docker and docker compose
#   - Foundry (forge) for contract deployment
#   - jq for JSON parsing

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
STANDARD_DIR="${STANDARD_DIR:-/Users/z/work/lux/standard}"
DEPLOYMENTS_FILE="$PROJECT_DIR/.local-deployments.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SKIP_DEPLOY=false
STOP_SERVICES=false
RESET_ALL=false

# Node endpoints
NODE_RPC_URL="${NODE_RPC_URL:-http://localhost:9650/ext/bc/C/rpc}"
NODE_HEALTH_URL="${NODE_HEALTH_URL:-http://localhost:9650/ext/health}"
GCHAIN_GRAPHQL_URL="${GCHAIN_GRAPHQL_URL:-http://localhost:9650/ext/bc/G/graphql}"

# Test account (Anvil default account #0)
# WARNING: This is a well-known test private key. NEVER use on mainnet!
DEPLOYER_PRIVATE_KEY="${DEPLOYER_PRIVATE_KEY:-0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80}"
DEPLOYER_ADDRESS="${DEPLOYER_ADDRESS:-0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266}"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-deploy)
            SKIP_DEPLOY=true
            shift
            ;;
        --down)
            STOP_SERVICES=true
            shift
            ;;
        --reset)
            RESET_ALL=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --no-deploy    Skip contract deployment"
            echo "  --down         Stop all services"
            echo "  --reset        Reset and start fresh (removes volumes)"
            echo "  -h, --help     Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

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

# Check required tools
check_requirements() {
    log_info "Checking requirements..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is required but not installed."
        exit 1
    fi

    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose is required but not installed."
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Install with: brew install jq"
        exit 1
    fi

    if ! $SKIP_DEPLOY; then
        if ! command -v forge &> /dev/null; then
            log_error "Foundry (forge) is required for contract deployment."
            log_error "Install with: curl -L https://foundry.paradigm.xyz | bash && foundryup"
            exit 1
        fi

        if [ ! -d "$STANDARD_DIR" ]; then
            log_error "Standard contracts directory not found: $STANDARD_DIR"
            log_error "Set STANDARD_DIR environment variable to the correct path."
            exit 1
        fi
    fi

    log_success "All requirements satisfied"
}

# Stop all services
stop_services() {
    log_info "Stopping services..."
    cd "$PROJECT_DIR"
    docker compose -f compose.local.yml down
    log_success "Services stopped"
}

# Reset everything
reset_all() {
    log_info "Resetting all data..."
    cd "$PROJECT_DIR"
    docker compose -f compose.local.yml down -v
    rm -f "$DEPLOYMENTS_FILE"
    log_success "Reset complete"
}

# Start Docker services
start_services() {
    log_info "Starting Docker services..."
    cd "$PROJECT_DIR"

    # Pull latest images
    docker compose -f compose.local.yml pull --quiet

    # Start services (without exchange for now, we'll start it after deployment)
    docker compose -f compose.local.yml up -d node postgres redis

    log_success "Docker services starting..."
}

# Wait for node to be healthy
wait_for_node() {
    log_info "Waiting for Lux node to be healthy..."

    local max_attempts=60
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if curl -sf "$NODE_HEALTH_URL" > /dev/null 2>&1; then
            log_success "Lux node is healthy"
            return 0
        fi

        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done

    echo ""
    log_error "Lux node failed to become healthy after $max_attempts attempts"
    exit 1
}

# Wait for C-Chain to be ready
wait_for_cchain() {
    log_info "Waiting for C-Chain to be ready..."

    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        local result
        result=$(curl -sf -X POST -H "Content-Type: application/json" \
            --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
            "$NODE_RPC_URL" 2>/dev/null || echo "")

        if [ -n "$result" ] && echo "$result" | jq -e '.result' > /dev/null 2>&1; then
            local chain_id
            chain_id=$(echo "$result" | jq -r '.result')
            log_success "C-Chain ready (chainId: $chain_id)"
            return 0
        fi

        attempt=$((attempt + 1))
        echo -n "."
        sleep 2
    done

    echo ""
    log_error "C-Chain failed to become ready"
    exit 1
}

# Fund deployer account (for local testing)
fund_deployer() {
    log_info "Checking deployer account balance..."

    local balance
    balance=$(curl -sf -X POST -H "Content-Type: application/json" \
        --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getBalance\",\"params\":[\"$DEPLOYER_ADDRESS\", \"latest\"],\"id\":1}" \
        "$NODE_RPC_URL" | jq -r '.result')

    if [ "$balance" = "0x0" ]; then
        log_warn "Deployer account has no balance. Attempting to fund..."

        # Try to use admin API to fund account (works with local node)
        local fund_result
        fund_result=$(curl -sf -X POST -H "Content-Type: application/json" \
            --data "{\"jsonrpc\":\"2.0\",\"method\":\"eth_sendTransaction\",\"params\":[{\"from\":\"0x0000000000000000000000000000000000000000\",\"to\":\"$DEPLOYER_ADDRESS\",\"value\":\"0x56BC75E2D63100000\"}],\"id\":1}" \
            "$NODE_RPC_URL" 2>/dev/null || echo "")

        if [ -z "$fund_result" ]; then
            log_warn "Could not auto-fund deployer. The node may need pre-funded accounts."
            log_warn "For local testing, ensure your node has genesis allocations."
        fi
    else
        log_success "Deployer account has balance: $balance"
    fi
}

# Deploy contracts
deploy_contracts() {
    if $SKIP_DEPLOY; then
        log_info "Skipping contract deployment (--no-deploy flag)"

        if [ -f "$DEPLOYMENTS_FILE" ]; then
            log_info "Using existing deployments from $DEPLOYMENTS_FILE"
        else
            log_warn "No deployments file found. Run without --no-deploy to deploy contracts."
        fi
        return 0
    fi

    log_info "Deploying contracts..."

    # Run the deploy script
    "$SCRIPT_DIR/deploy-contracts.sh"

    if [ -f "$DEPLOYMENTS_FILE" ]; then
        log_success "Contracts deployed successfully"
        log_info "Deployment addresses:"
        jq '.' "$DEPLOYMENTS_FILE"
    else
        log_error "Contract deployment failed - no deployments file created"
        exit 1
    fi
}

# Update environment file with deployment addresses
update_env() {
    log_info "Updating environment configuration..."

    if [ ! -f "$DEPLOYMENTS_FILE" ]; then
        log_warn "No deployments file found, skipping env update"
        return 0
    fi

    local env_local="$PROJECT_DIR/.env.local"

    # Read deployment addresses
    local wlux=$(jq -r '.wlux // empty' "$DEPLOYMENTS_FILE")
    local lusd=$(jq -r '.lusd // empty' "$DEPLOYMENTS_FILE")
    local weth=$(jq -r '.weth // empty' "$DEPLOYMENTS_FILE")
    local factory=$(jq -r '.factory // empty' "$DEPLOYMENTS_FILE")
    local router=$(jq -r '.router // empty' "$DEPLOYMENTS_FILE")
    local multicall=$(jq -r '.multicall // empty' "$DEPLOYMENTS_FILE")

    # Create/update .env.local
    cat > "$env_local" << EOF
# Auto-generated by local-setup.sh
# Local Testing Configuration

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Local Chain
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_NETWORK_NAME=Lux Local

# RPC Endpoints
NEXT_PUBLIC_LOCAL_RPC_URL=http://localhost:9650/ext/bc/C/rpc
NEXT_PUBLIC_LUX_RPC_URL=http://localhost:9650/ext/bc/C/rpc

# G-Chain GraphQL (replaces subgraph)
NEXT_PUBLIC_GCHAIN_GRAPHQL_URL=http://localhost:9650/ext/bc/G/graphql

# Contract Addresses (deployed locally)
NEXT_PUBLIC_WLUX_ADDRESS=$wlux
NEXT_PUBLIC_LUSD_ADDRESS=$lusd
NEXT_PUBLIC_WETH_ADDRESS=$weth
NEXT_PUBLIC_V2_FACTORY_ADDRESS=$factory
NEXT_PUBLIC_V2_ROUTER_ADDRESS=$router
NEXT_PUBLIC_MULTICALL_ADDRESS=$multicall

# Feature Flags
NEXT_PUBLIC_ENABLE_TESTNETS=true
NEXT_PUBLIC_ENABLE_LOCAL=true

# Database (for API)
DATABASE_URL=postgresql://exchange:exchange_local_dev@localhost:5432/exchange

# Redis
REDIS_URL=redis://localhost:6379
EOF

    log_success "Environment file updated: $env_local"
}

# Start the exchange app
start_exchange() {
    log_info "Starting exchange application..."
    cd "$PROJECT_DIR"

    # Start the exchange container with updated env
    docker compose -f compose.local.yml up -d exchange

    log_success "Exchange starting at http://localhost:3000"
}

# Verify G-Chain is accessible
verify_gchain() {
    log_info "Verifying G-Chain GraphQL endpoint..."

    local max_attempts=10
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        local result
        result=$(curl -sf -X POST -H "Content-Type: application/json" \
            --data '{"query":"{ __schema { types { name } } }"}' \
            "$GCHAIN_GRAPHQL_URL" 2>/dev/null || echo "")

        if [ -n "$result" ]; then
            log_success "G-Chain GraphQL endpoint is accessible"
            return 0
        fi

        attempt=$((attempt + 1))
        sleep 2
    done

    log_warn "G-Chain GraphQL not responding (may not be enabled in this node build)"
}

# Print summary
print_summary() {
    echo ""
    echo "=============================================="
    echo -e "${GREEN}Local Development Environment Ready${NC}"
    echo "=============================================="
    echo ""
    echo "Services:"
    echo "  Exchange:    http://localhost:3000"
    echo "  C-Chain RPC: http://localhost:9650/ext/bc/C/rpc"
    echo "  G-Chain GQL: http://localhost:9650/ext/bc/G/graphql"
    echo "  PostgreSQL:  localhost:5432"
    echo "  Redis:       localhost:6379"
    echo ""

    if [ -f "$DEPLOYMENTS_FILE" ]; then
        echo "Deployed Contracts:"
        echo "  WLUX:     $(jq -r '.wlux // "N/A"' "$DEPLOYMENTS_FILE")"
        echo "  LUSD:     $(jq -r '.lusd // "N/A"' "$DEPLOYMENTS_FILE")"
        echo "  WETH:     $(jq -r '.weth // "N/A"' "$DEPLOYMENTS_FILE")"
        echo "  Factory:  $(jq -r '.factory // "N/A"' "$DEPLOYMENTS_FILE")"
        echo "  Router:   $(jq -r '.router // "N/A"' "$DEPLOYMENTS_FILE")"
        echo ""
    fi

    echo "Test Account:"
    echo "  Address:  $DEPLOYER_ADDRESS"
    echo "  Key:      $DEPLOYER_PRIVATE_KEY"
    echo ""
    echo "Commands:"
    echo "  Stop:     ./scripts/local-setup.sh --down"
    echo "  Reset:    ./scripts/local-setup.sh --reset"
    echo "  Logs:     docker compose -f compose.local.yml logs -f"
    echo "  Deploy:   ./scripts/deploy-contracts.sh"
    echo ""
    echo "E2E Tests:"
    echo "  pnpm test:e2e"
    echo ""
}

# Main execution
main() {
    echo ""
    echo "=============================================="
    echo "  Lux Exchange - Local Setup"
    echo "=============================================="
    echo ""

    if $STOP_SERVICES; then
        stop_services
        exit 0
    fi

    if $RESET_ALL; then
        reset_all
    fi

    check_requirements
    start_services
    wait_for_node
    wait_for_cchain
    fund_deployer
    deploy_contracts
    update_env
    verify_gchain
    start_exchange
    print_summary
}

main
