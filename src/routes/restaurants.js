const express = require('express');
const { pool } = require('../db/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Helper to map DB row → Flutter model shape
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

function mapProduct(row) {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    imageUrl: row.image_url,
    category: row.category,
  };
}

// ── GET /restaurants ──────────────────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants ORDER BY name');
    res.json({ restaurants: result.rows.map(mapRestaurant) });
  } catch (err) {
    console.error('GET /restaurants error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /restaurants/:id ──────────────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ restaurant: mapRestaurant(result.rows[0]) });
  } catch (err) {
    console.error('GET /restaurants/:id error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /restaurants/:id/products ─────────────────────────────────────────────
router.get('/:id/products', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE restaurant_id = $1 ORDER BY category, name',
      [req.params.id]
    );
    res.json({ products: result.rows.map(mapProduct) });
  } catch (err) {
    console.error('GET /restaurants/:id/products error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
