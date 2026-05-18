require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/database');

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/search', searchRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

async function start() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
