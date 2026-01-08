#!/bin/bash
# Unified development script for LX Exchange + LXD daemon
# Usage: ./scripts/dev-unified.sh [--gateway-only] [--web-only]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
EXCHANGE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEX_DIR="$HOME/work/lux/dex"
LXD_BINARY="$DEX_DIR/lxd"
GATEWAY_PORT=8085
WEB_PORT=9000

# PID files
LXD_PID_FILE="/tmp/lxd-gateway.pid"
WEB_PID_FILE="/tmp/lx-web.pid"

log() {
    echo -e "${GREEN}[LX]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[LX]${NC} $1"
}

error() {
    echo -e "${RED}[LX]${NC} $1"
}

cleanup() {
    log "Shutting down services..."

    if [ -f "$LXD_PID_FILE" ]; then
        PID=$(cat "$LXD_PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID" 2>/dev/null || true
            log "Stopped LXD gateway (PID: $PID)"
        fi
        rm -f "$LXD_PID_FILE"
    fi

    if [ -f "$WEB_PID_FILE" ]; then
        PID=$(cat "$WEB_PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID" 2>/dev/null || true
            log "Stopped web server (PID: $PID)"
        fi
        rm -f "$WEB_PID_FILE"
    fi

    # Kill any orphaned processes on our ports
    lsof -ti:$GATEWAY_PORT | xargs kill -9 2>/dev/null || true
    lsof -ti:$WEB_PORT | xargs kill -9 2>/dev/null || true

    log "Cleanup complete"
    exit 0
}

trap cleanup EXIT INT TERM

start_lxd_gateway() {
    log "Starting LXD gateway on port $GATEWAY_PORT..."

    if [ ! -f "$LXD_BINARY" ]; then
        error "LXD binary not found at $LXD_BINARY"
        error "Please build it first: cd $DEX_DIR && go build -o lxd ./cmd/gateway"
        exit 1
    fi

    # Check if port is in use
    if lsof -ti:$GATEWAY_PORT >/dev/null 2>&1; then
        warn "Port $GATEWAY_PORT already in use, killing existing process..."
        lsof -ti:$GATEWAY_PORT | xargs kill -9 2>/dev/null || true
        sleep 1
    fi

    # Start LXD gateway with Uniswap fallback enabled
    log "Binary: $LXD_BINARY"
    nohup "$LXD_BINARY" -addr ":$GATEWAY_PORT" -fallback > /tmp/lxd-gateway.log 2>&1 &
    echo $! > "$LXD_PID_FILE"

    log "LXD gateway starting (PID: $(cat $LXD_PID_FILE))..."

    # Wait for gateway to be ready
    for i in {1..30}; do
        if curl -s "http://localhost:$GATEWAY_PORT/v1/health" >/dev/null 2>&1 || \
           curl -s "http://localhost:$GATEWAY_PORT/" >/dev/null 2>&1; then
            log "LXD gateway ready on http://localhost:$GATEWAY_PORT"
            return 0
        fi
        sleep 0.5
    done

    warn "LXD gateway may still be starting, check /tmp/lxd-gateway.log"
}

start_web_server() {
    log "Starting web server on port $WEB_PORT..."

    # Check if port is in use
    if lsof -ti:$WEB_PORT >/dev/null 2>&1; then
        warn "Port $WEB_PORT already in use, killing existing process..."
        lsof -ti:$WEB_PORT | xargs kill -9 2>/dev/null || true
        sleep 1
    fi

    cd "$EXCHANGE_DIR"

    # Start web server
    nohup bun run --cwd apps/web dev > /tmp/lx-web.log 2>&1 &
    echo $! > "$WEB_PID_FILE"

    # Wait for web server to be ready
    for i in {1..60}; do
        if curl -s "http://localhost:$WEB_PORT" >/dev/null 2>&1; then
            log "Web server ready on http://localhost:$WEB_PORT"
            return 0
        fi
        sleep 1
    done

    warn "Web server may not be fully ready, check /tmp/lx-web.log"
}

show_status() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}                    LX Development Stack                        ${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${GREEN}LXD Gateway:${NC}  http://localhost:$GATEWAY_PORT"
    echo -e "  ${GREEN}Web App:${NC}      http://localhost:$WEB_PORT"
    echo ""
    echo -e "  ${YELLOW}Logs:${NC}"
    echo -e "    Gateway: tail -f /tmp/lxd-gateway.log"
    echo -e "    Web:     tail -f /tmp/lx-web.log"
    echo ""
    echo -e "  ${YELLOW}Press Ctrl+C to stop all services${NC}"
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

# Parse arguments
GATEWAY_ONLY=false
WEB_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --gateway-only)
            GATEWAY_ONLY=true
            shift
            ;;
        --web-only)
            WEB_ONLY=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Main
log "Starting unified LX development environment..."

if [ "$WEB_ONLY" = false ]; then
    start_lxd_gateway
fi

if [ "$GATEWAY_ONLY" = false ]; then
    start_web_server
fi

show_status

# Keep script running and tail logs
if [ "$GATEWAY_ONLY" = true ]; then
    tail -f /tmp/lxd-gateway.log
elif [ "$WEB_ONLY" = true ]; then
    tail -f /tmp/lx-web.log
else
    tail -f /tmp/lxd-gateway.log /tmp/lx-web.log
fi
