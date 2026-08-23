# Wedding website — local dev tasks.
# Recipes run in Git Bash on Windows; falls back to sh elsewhere.
set windows-shell := ["C:/Program Files/Git/bin/bash.exe", "-cu"]
set dotenv-load := true

db_container := "wedding-db"
db_image     := "postgres:16-alpine"
db_user      := "wedding"
db_password  := "wedding"
db_name      := "wedding_db"
db_port      := "5432"

# Show all recipes
default:
    just --list

# Install npm dependencies
install:
    npm install

# Start Postgres in Docker (reuses the container if it already exists)
db-up:
    docker start {{db_container}} 2>/dev/null || docker run -d --name {{db_container}} -e POSTGRES_USER={{db_user}} -e POSTGRES_PASSWORD={{db_password}} -e POSTGRES_DB={{db_name}} -p {{db_port}}:5432 {{db_image}}

# Wait until Postgres is accepting connections
db-wait:
    for i in $(seq 1 30); do docker exec {{db_container}} pg_isready -U {{db_user}} -d {{db_name}} >/dev/null 2>&1 && { echo "Postgres ready"; exit 0; }; echo -n "."; sleep 1; done; echo "timed out waiting for Postgres"; exit 1

# Stop the Postgres container (keeps data)
db-down:
    docker stop {{db_container}}

# Remove the Postgres container and its data
db-nuke:
    -docker rm -f {{db_container}}

# Push the Prisma schema to the database
db-push:
    npx prisma db push

# Open Prisma Studio
db-studio:
    npx prisma studio

# Recreate the database from scratch
db-reset: db-nuke db-up db-wait db-push
    @echo "Database reset complete."

# One-shot: install deps, start db, push schema
setup: install db-up db-wait db-push
    @echo "Setup complete — run 'just dev' to start the site."

# Run the Next.js dev server
dev:
    npm run dev

# Production build
build:
    npm run build

# Start the production server
start:
    npm run start

# Lint the project
lint:
    npm run lint
