#!/usr/bin/env bash
set -euo pipefail

echo "=== Starting PostgreSQL on port 5433 ==="
docker compose up -d postgres

echo "=== Waiting for PostgreSQL to be ready ==="
until docker compose exec -T postgres pg_isready -U errorexplainer -d errorexplainer > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is ready (migration runs automatically on first start)."

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit backend/.env and set your GROQ_API_KEY"
echo "  2. Start the backend:  ./start-backend.sh"
echo "  3. Start the frontend: ./start-frontend.sh"
echo "  4. Open http://localhost:5173"
