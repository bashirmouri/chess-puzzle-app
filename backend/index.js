const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/puzzle/today/:numberOfRow', async (req, res) => { 
  const numberOfRow = req.params.numberOfRow;
  console.log('nub of row: ',numberOfRow)
  try{
    const result = await pool.query('SELECT * FROM puzzles ORDER BY id');
    console.log(JSON.stringify(result.rows[numberOfRow], null, 2))
    res.status(200).json(result.rows[numberOfRow]);
  }catch(err){
    console.error(err)
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
