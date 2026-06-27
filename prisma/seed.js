require("dotenv").config()
const { PrismaClient } = require("@prisma/client")
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.preorder.createMany({
    data: [
      { name: "Multi variant 3",   products: 1, preorderWhen: "out-of-stock",        startsAt: new Date("2025-12-15T20:24:00"), endsAt: null,                           status: "active"   },
      { name: "Multi variant 2",   products: 1, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-12-15T20:24:00"), endsAt: new Date("2025-12-15T20:27:00"), status: "active"   },
      { name: "Multi variants 1",  products: 1, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-12-15T20:24:00"), endsAt: null,                           status: "inactive" },
      { name: "Partial payment",   products: 1, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-08-17T16:56:00"), endsAt: null,                           status: "active"   },
      { name: "Shipping not sure", products: 1, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-08-17T16:57:00"), endsAt: null,                           status: "active"   },
      { name: "Full payment",      products: 1, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-08-17T16:56:00"), endsAt: null,                           status: "active"   },
      { name: "Coming soon",       products: 1, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-12-11T04:42:00"), endsAt: null,                           status: "active"   },
      { name: "With ends",         products: 1, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-08-14T15:59:00"), endsAt: null,                           status: "active"   },
      { name: "Early bird",        products: 2, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-09-01T10:00:00"), endsAt: new Date("2025-09-30T23:59:00"), status: "active"   },
      { name: "Limited edition",   products: 1, preorderWhen: "out-of-stock",        startsAt: new Date("2025-10-15T12:00:00"), endsAt: null,                           status: "inactive" },
      { name: "Premium bundle",    products: 3, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-11-01T08:00:00"), endsAt: new Date("2025-11-30T20:00:00"), status: "active"   },
      { name: "Flash sale",        products: 1, preorderWhen: "out-of-stock",        startsAt: new Date("2025-12-01T06:00:00"), endsAt: new Date("2025-12-02T06:00:00"), status: "active"   },
      { name: "Year-end deal",     products: 2, preorderWhen: "regardless-of-stock", startsAt: new Date("2025-12-20T09:00:00"), endsAt: null,                           status: "active"   },
    ],
  })
  console.log("✅ Seeded 13 preorders!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())