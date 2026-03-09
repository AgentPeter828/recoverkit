#!/bin/bash
# Switch between environment modes: mock, test, prod
# Usage: ./scripts/env-switch.sh [mock|test|prod]

set -e
cd "$(dirname "$0")/.."

MODE="${1:-mock}"

case "$MODE" in
  mock)
    cp .env.mock .env.local
    echo "✅ Switched to MOCK mode — all local data, no external services"
    ;;
  test)
    cp .env.test .env.local
    echo "✅ Switched to TEST mode — real APIs with test/sandbox keys"
    ;;
  prod)
    if [ ! -s .env.production ] || grep -q "sk_live_\.\.\." .env.production 2>/dev/null; then
      echo "❌ .env.production has placeholder values — fill in real keys first"
      exit 1
    fi
    cp .env.production .env.local
    echo "⚠️  Switched to PRODUCTION mode — live keys, real money"
    ;;
  *)
    echo "Usage: $0 [mock|test|prod]"
    echo "  mock  — All mock data, no external services"
    echo "  test  — Real APIs with test/sandbox keys"
    echo "  prod  — Production keys (real money)"
    exit 1
    ;;
esac

echo "→ Restart your dev server to pick up changes"
