const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/puzzle/today', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const result = await pool.query('SELECT * FROM puzzles WHERE puzzle_date = $1', [today]);
  res.json(result.rows[0]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
