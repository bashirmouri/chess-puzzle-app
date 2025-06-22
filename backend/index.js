const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/puzzle/today', async (req, res) => {

  try{
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query('SELECT * FROM puzzles');
    console.log(today,result)
    res.status(200).json(result.rows[0]);
  }catch(err){
    console.error(err)
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
