const express = require("express");
const router = express.Router();
const Business = require("../models/Business");

// GET /api/businesses/stats
// Must be defined BEFORE the "/" route's dynamic pieces are not an issue here,
// but keep it above any /:id style route if one is ever added.
router.get("/stats", async (req, res) => {
  try {
    const total = await Business.countDocuments();
    const cities = await Business.distinct("city");
    const categories = await Business.distinct("category");

    res.json({
      total,
      cities: cities.length,
      categories: categories.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load stats" });
  }
});

// GET /api/businesses?q=bakery&category=Food
router.get("/", async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { name: regex },
        { tagline: regex },
        { city: regex },
      ];
    }

    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load businesses" });
  }
});

// POST /api/businesses
router.post("/", async (req, res) => {
  try {
    const { name, owner, category, city, tagline, website, email } = req.body;

    const business = new Business({
      name,
      owner,
      category,
      city,
      tagline,
      website,
      email,
    });

    const saved = await business.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      const fields = {};
      for (const key in err.errors) {
        fields[key] = err.errors[key].message;
      }
      return res.status(400).json({ error: "Validation failed", fields });
    }
    console.error(err);
    res.status(500).json({ error: "Could not save business" });
  }
});

module.exports = router;
