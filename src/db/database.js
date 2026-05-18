const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id        SERIAL PRIMARY KEY,
        name      TEXT NOT NULL,
        email     TEXT UNIQUE NOT NULL,
        password  TEXT NOT NULL,
        gender    TEXT,
        level     INTEGER CHECK (level IN (1,2,3,4)),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        address       TEXT NOT NULL,
        description   TEXT NOT NULL,
        rating        NUMERIC(3,1) NOT NULL,
        review_count  INTEGER NOT NULL,
        image_url     TEXT NOT NULL,
        cuisine       TEXT NOT NULL,
        type          TEXT NOT NULL,
        latitude      NUMERIC(9,6) NOT NULL,
        longitude     NUMERIC(9,6) NOT NULL,
        phone_number  TEXT NOT NULL,
        opening_hours TEXT NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id            TEXT PRIMARY KEY,
        restaurant_id TEXT NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
        name          TEXT NOT NULL,
        description   TEXT NOT NULL,
        price         NUMERIC(10,2) NOT NULL,
        image_url     TEXT NOT NULL,
        category      TEXT NOT NULL
      );
    `);

    const { rows: rCount } = await client.query('SELECT COUNT(*) FROM restaurants');
    if (parseInt(rCount[0].count) === 0) {
      await client.query(`
        INSERT INTO restaurants VALUES
          ('r1','The Golden Fork','15 Tahrir Square, Cairo, Egypt',
           'A premium dining experience offering a fusion of Middle Eastern and Mediterranean cuisines.',
           4.8,432,'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
           'Mediterranean','restaurant',30.044400,31.235700,'+20 2 2391 0000','Mon–Sun: 11:00 AM – 11:00 PM'),
          ('r2','Café Royale','88 Zamalek St, Cairo, Egypt',
           'A cozy European-style café serving specialty coffees, pastries, and light bites.',
           4.6,289,'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
           'European','cafe',30.062600,31.219700,'+20 2 2736 0000','Mon–Sun: 8:00 AM – 10:00 PM'),
          ('r3','Spice Route','22 Hussein District, Cairo, Egypt',
           'Authentic Indian and Asian cuisine in the heart of historic Cairo.',
           4.5,317,'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
           'Asian','restaurant',30.049100,31.262900,'+20 2 2513 0000','Tue–Sun: 12:00 PM – 11:30 PM'),
          ('r4','Brew & Bean','5 Maadi Corniche, Cairo, Egypt',
           'Specialty coffee roasters and artisan café with garden seating.',
           4.7,198,'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
           'Café','cafe',29.960500,31.257800,'+20 2 2380 0000','Mon–Fri: 7:00 AM – 9:00 PM'),
          ('r5','Casa Italiana','44 Heliopolis Ave, Cairo, Egypt',
           'Authentic Italian trattoria with wood-fired pizzas and handmade pastas.',
           4.9,512,'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
           'Italian','restaurant',30.087400,31.321200,'+20 2 2418 0000','Mon–Sun: 12:00 PM – 12:00 AM'),
          ('r6','The Sushi Garden','9 New Cairo Business District, Cairo, Egypt',
           'Premium Japanese restaurant featuring fresh sushi, sashimi, and ramen.',
           4.6,274,'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
           'Japanese','restaurant',30.013100,31.433300,'+20 2 2758 0000','Tue–Sun: 1:00 PM – 11:00 PM'),
          ('r7','Morning Glory Café','3 Mohandessin St, Giza, Egypt',
           'A welcoming neighbourhood café known for breakfast all day and artisan coffee.',
           4.4,156,'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800',
           'Café','cafe',30.055700,31.201000,'+20 2 3345 0000','Mon–Sun: 7:00 AM – 8:00 PM'),
          ('r8','El Greco Taverna','17 Dokki Square, Giza, Egypt',
           'Greek-inspired restaurant with grilled meats, fresh salads, and mezze platters.',
           4.3,203,'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
           'Greek','restaurant',30.038800,31.212400,'+20 2 3361 0000','Mon–Sun: 11:00 AM – 10:30 PM');
      `);

      await client.query(`
        INSERT INTO products VALUES
          ('p1','r1','Grilled Salmon','Atlantic salmon fillet with herb butter and vegetables',185.00,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400','Main Course'),
          ('p2','r1','Caesar Salad','Crispy romaine, parmesan, croutons, caesar dressing',75.00,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400','Salads'),
          ('p3','r1','Tiramisu','Classic Italian dessert with espresso-soaked ladyfingers',65.00,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400','Desserts'),
          ('p4','r1','Margherita Pizza','Tomato, mozzarella, fresh basil on thin crust',120.00,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400','Pizza'),
          ('p5','r2','Cappuccino','Double espresso with steamed milk foam',45.00,'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400','Hot Drinks'),
          ('p6','r2','Croissant','Buttery, flaky French-style croissant',35.00,'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400','Pastries'),
          ('p7','r2','Caesar Salad','Light version with grilled chicken strips',80.00,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400','Salads'),
          ('p8','r2','Tiramisu','House-made tiramisu with rum-soaked biscuits',55.00,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400','Desserts'),
          ('p9','r3','Butter Chicken','Slow-cooked chicken in a rich tomato-cream sauce',135.00,'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400','Main Course'),
          ('p10','r3','Pad Thai','Stir-fried rice noodles with shrimp, peanuts, lime',110.00,'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400','Main Course'),
          ('p11','r3','Mango Lassi','Chilled yogurt-based mango drink',40.00,'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400','Cold Drinks'),
          ('p12','r4','Cappuccino','Single-origin espresso with velvety micro-foam',50.00,'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400','Hot Drinks'),
          ('p13','r4','Cold Brew','18-hour cold-steeped coffee served over ice',55.00,'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400','Cold Drinks'),
          ('p14','r4','Avocado Toast','Sourdough, smashed avocado, poached egg, chili flakes',85.00,'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400','Breakfast'),
          ('p15','r4','Croissant','Almond-filled croissant baked fresh daily',40.00,'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400','Pastries'),
          ('p16','r5','Margherita Pizza','San Marzano tomato, buffalo mozzarella, fresh basil',130.00,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400','Pizza'),
          ('p17','r5','Carbonara Pasta','Spaghetti, guanciale, eggs, pecorino romano',140.00,'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400','Pasta'),
          ('p18','r5','Tiramisu','Authentic recipe with mascarpone and espresso',70.00,'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400','Desserts'),
          ('p19','r5','Grilled Salmon','Mediterranean-seasoned salmon with capers and olives',195.00,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400','Main Course'),
          ('p20','r6','Salmon Sashimi','Fresh Norwegian salmon, 8 pieces with wasabi',160.00,'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400','Sashimi'),
          ('p21','r6','Dragon Roll','Shrimp tempura roll topped with avocado and eel sauce',145.00,'https://images.unsplash.com/photo-1562802378-063ec186a863?w=400','Rolls'),
          ('p22','r6','Ramen','Tonkotsu broth, chashu pork, soft-boiled egg, nori',130.00,'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400','Main Course'),
          ('p23','r7','Cappuccino','Rich espresso with creamy steamed milk',42.00,'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400','Hot Drinks'),
          ('p24','r7','Avocado Toast','Multigrain toast with avocado, feta, and cherry tomatoes',78.00,'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400','Breakfast'),
          ('p25','r7','Pancake Stack','Fluffy buttermilk pancakes with maple syrup and berries',68.00,'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400','Breakfast'),
          ('p26','r8','Greek Salad','Tomatoes, cucumber, olives, feta, oregano, olive oil',70.00,'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400','Salads'),
          ('p27','r8','Lamb Souvlaki','Grilled lamb skewers with tzatziki and pita',150.00,'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400','Grills'),
          ('p28','r8','Baklava','Honey-soaked phyllo pastry with mixed nuts',55.00,'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400','Desserts');
      `);

      console.log('✅ Database seeded with restaurants and products');
    }

    await client.query('COMMIT');
    console.log('✅ Database initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database init error:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, initDb };