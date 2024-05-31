echo "Docker compose build..."
docker compose build --no-cache

echo "Docker compose up..."
docker compose up -d

echo "Prisma generating..."
docker exec -it library-node npm run prisma generate

echo "Prisma migrate..."
docker exec -it library-node npm run migrate

echo "Prisma seeding category..."
docker exec -it library-node npm run seeder category