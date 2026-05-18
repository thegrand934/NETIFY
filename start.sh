#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Starting NETIFY backend on port 5000..."
cd "$ROOT/backend"
npm run dev &
BACKEND_PID=$!

sleep 4

echo "Starting NETIFY admin on port 3001..."
cd "$ROOT/admin"
npm run dev &
ADMIN_PID=$!

echo ""
echo "============================================"
echo "  NETIFY is starting"
echo "  Backend:  http://localhost:5000"
echo "  Admin:    http://localhost:3001/login"
echo "  Login:    admin@netify.com / admin123"
echo "============================================"
echo ""
echo "Press Ctrl+C to stop all services."

trap "kill $BACKEND_PID $ADMIN_PID 2>/dev/null" EXIT
wait
