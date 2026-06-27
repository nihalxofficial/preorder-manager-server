# Preorder Manager — Backend API

Express.js + Prisma + SQLite REST API for the Preorder Manager app.

---

## Tech Stack

- **Node.js** with Express.js
- **Prisma ORM** (v7) with `prisma-client-js`
- **SQLite** via `@prisma/adapter-better-sqlite3`
- **dotenv** for environment variables

---

## Project Structure

```
preorder-manager-server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Auto-generated migrations
│   ├── seed.js             # Sample data seeder
│   └── dev.db              # SQLite database (auto-created)
├── src/
│   ├── index.js            # App entry point (port, cors, routes)
│   └── routes/
│       └── preorders.js    # All preorder API routes
├── .env                    # Environment variables
├── prisma.config.js        # Prisma v7 config
└── package.json
```

---

## Prerequisites

- Node.js v18 or higher
- npm

---

## Setup & Run Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd preorder-manager-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=5000
```

### 4. Database setup

Generate the Prisma client:

```bash
npx prisma generate
```

Run migrations to create the database and tables:

```bash
npx prisma migrate dev --name init
```

This automatically creates `prisma/dev.db`.

### 5. Seed sample data

```bash
node prisma/seed.js
```

This inserts 13 sample preorders into the database.

### 6. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/preorders` | List all preorders (filter, sort, paginate) |
| GET | `/api/preorders/:id` | Get single preorder |
| POST | `/api/preorders` | Create new preorder |
| PUT | `/api/preorders/:id` | Update existing preorder |
| PATCH | `/api/preorders/:id/status` | Toggle active/inactive status |
| DELETE | `/api/preorders/:id` | Delete a preorder |

### Query Parameters for GET `/api/preorders`

| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| `status` | `all`, `active`, `inactive` | — | Filter by status |
| `sortBy` | `name`, `products`, `startsAt`, `endsAt`, `status`, `createdAt` | `createdAt` | Sort field |
| `order` | `asc`, `desc` | `desc` | Sort direction |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Records per page |

**Example:**
```
GET /api/preorders?status=active&sortBy=name&order=asc&page=1&limit=10
```

---

## Database Schema

```prisma
model Preorder {
  id           Int       @id @default(autoincrement())
  name         String
  products     Int       @default(1)
  preorderWhen String    @default("regardless-of-stock")
  startsAt     DateTime
  endsAt       DateTime?
  status       String    @default("active")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

---

## Useful Commands

```bash
npm run dev          # Start dev server with nodemon
npm start            # Start production server
npx prisma studio    # Open Prisma visual DB browser
npx prisma generate  # Regenerate Prisma client after schema changes
```

---

## Notes

- SQLite database file is created automatically at `prisma/dev.db`
- For production deployment, point `DATABASE_URL` to a persistent disk path (e.g. `file:/data/prod.db`) and run `npx prisma migrate deploy` instead of `migrate dev`