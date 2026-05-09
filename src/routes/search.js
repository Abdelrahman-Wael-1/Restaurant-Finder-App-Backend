const express = require('express');
const { pool } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function mapRestaurant(row) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    description: row.description,
    rating: parseFloat(row.rating),
    reviewCount: row.review_count,
    imageUrl: row.image_url,
    cuisine: row.cuisine,
    type: row.type,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    phoneNumber: row.phone_number,
    openingHours: row.opening_hours,
  };
}

// ── GET /search/products ──────────────────────────────────────────────────────
// Returns all distinct product names (for the search dropdown)
router.get('/products', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT DISTINCT name FROM products ORDER BY name'
    );
    res.json({ products: result.rows.map(r => r.name) });
  } catch (err) {
    console.error('GET /search/products error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /search?name=<productName> ────────────────────────────────────────────
// Returns restaurants that serve the given product
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Query parameter "name" is required' });
    }

    const result = await pool.query(
      `SELECT DISTINCT r.*
       FROM restaurants r
       JOIN products p ON p.restaurant_id = r.id
       WHERE LOWER(p.name) = LOWER($1)
       ORDER BY r.name`,
      [name]
    );

    res.json({ restaurants: result.rows.map(mapRestaurant) });
  } catch (err) {
    console.error('GET /search error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
