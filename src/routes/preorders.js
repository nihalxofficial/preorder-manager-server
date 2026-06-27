// routes/preorders.js
require("dotenv").config();
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ALLOWED_SORTS = [
  "name",
  "createdAt",
  "startsAt",
  "endsAt",
  "status",
  "products",
  "preorderWhen",
];

// ========== GET /api/preorders ==========
// Query params: status, sortBy, order, page, limit
router.get("/", async (req, res) => {
  try {
    const {
      status,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 8,
    } = req.query;

    // Build where clause
    const where = {};
    if (status && status !== "all" && status !== "All") {
      where.status = status;
    }

    // Build order by
    const orderBy = ALLOWED_SORTS.includes(sortBy)
      ? { [sortBy]: order === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Get data and total count
    const [data, total] = await Promise.all([
      prisma.preorder.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.preorder.count({ where }),
    ]);

    res.json({
      data,
      meta: {
        total,
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    console.error("GET /api/preorders error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ========== GET /api/preorders/:id ==========
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const preorder = await prisma.preorder.findUnique({
      where: { id },
    });

    if (!preorder) {
      return res.status(404).json({ error: "Preorder not found" });
    }

    res.json(preorder);
  } catch (err) {
    console.error("GET /api/preorders/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ========== POST /api/preorders ==========
router.post("/", async (req, res) => {
  try {
    const { name, products, preorderWhen, startsAt, endsAt, status } = req.body;

    // Validation
    if (!name || !startsAt) {
      return res.status(400).json({ error: "name and startsAt are required" });
    }

    const preorder = await prisma.preorder.create({
      data: {
        name,
        products: Number(products) || 1,
        preorderWhen: preorderWhen || "regardless-of-stock",
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status: status || "active",
      },
    });

    res.status(201).json(preorder);
  } catch (err) {
    console.error("POST /api/preorders error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ========== PUT /api/preorders/:id ==========
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const { name, products, preorderWhen, startsAt, endsAt, status } = req.body;

    // Validation
    if (!name || !startsAt) {
      return res.status(400).json({ error: "name and startsAt are required" });
    }

    const preorder = await prisma.preorder.update({
      where: { id },
      data: {
        name,
        products: Number(products) || 1,
        preorderWhen: preorderWhen || "regardless-of-stock",
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        status,
      },
    });

    res.json(preorder);
  } catch (err) {
    console.error("PUT /api/preorders/:id error:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Preorder not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

// routes/preorders.js - Fix the status toggle endpoint
router.patch("/:id/status", async (req, res) => {
  try {
    // FIX: Parse ID as integer
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const existing = await prisma.preorder.findUnique({
      where: { id },
    });
    if (!existing) return res.status(404).json({ error: "Not found" });

    const preorder = await prisma.preorder.update({
      where: { id },
      data: { status: existing.status === "active" ? "inactive" : "active" },
    });
    res.json(preorder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Also fix DELETE endpoint
router.delete("/:id", async (req, res) => {
  try {
    // FIX: Parse ID as integer
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    await prisma.preorder.delete({
      where: { id },
    });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Not found" });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
