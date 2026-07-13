#!/bin/zsh
# One-command setup for FleetOps Console.
# Run this from the project root: ./setup.sh

set -e

echo "==> Checking for server/.env"
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  ACCESS_SECRET=$(openssl rand -hex 32)
  REFRESH_SECRET=$(openssl rand -hex 32)
  # Portable in-place sed for both macOS (BSD sed) and Linux (GNU sed)
  sed -i.bak "s/JWT_ACCESS_SECRET=.*/JWT_ACCESS_SECRET=${ACCESS_SECRET}/" server/.env
  sed -i.bak "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=${REFRESH_SECRET}/" server/.env
  rm -f server/.env.bak
  echo "    Created server/.env with fresh random JWT secrets."
else
  echo "    server/.env already exists, leaving it as is."
fi

echo "==> Tearing down any previous containers/volumes"
docker compose down -v 2>/dev/null || true

echo "==> Building and starting mongo + api + client (detached)"
docker compose up --build -d

echo "==> Waiting for the API to report healthy..."
for i in $(seq 1 30); do
  if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "    API is up."
    break
  fi
  sleep 2
done

echo "==> Seeding the database"
docker compose exec -T api node dist/scripts/seed.js

echo ""
echo "Done. Open http://localhost:5173 and log in with:"
echo "  admin@fleetops.dev / password123"
echo "  operator@fleetops.dev / password123"
echo "  viewer@fleetops.dev / password123"
echo ""
echo "To see logs at any time:   docker compose logs -f"
echo "To stop everything:        docker compose down"
