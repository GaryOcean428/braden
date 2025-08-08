#!/bin/bash
echo "=== Gary-Zero Health Check ==="
npm run audit:deps
npm outdated
npx bundlesize
npm run test:coverage --silent
npm run lint --quiet
npm run build --quiet
echo "=== Health Check Complete ==="