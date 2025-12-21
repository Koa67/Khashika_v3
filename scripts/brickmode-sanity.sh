#!/usr/bin/env bash
set -euo pipefail

./scripts/guard-cursor-config.sh

pnpm exec eslint --max-warnings 0 \
  --no-error-on-unmatched-pattern \
  --ignore-pattern '_tools/**' \
  --ignore-pattern 'khashika-filters/**' \
  --ignore-pattern 'khashika-image-fix/**' \
  .

pnpm build
pnpm test:e2e tests/e2e/checkout-flow.spec.ts

echo "BRICKMODE SANITY: PASS"
