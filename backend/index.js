const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

  app.get('/api/puzzle/today/:puzzleId', async (req, res) => { 
  const puzzleId = req.params.puzzleId; // this is the puzzle id
  try {
    console.log("Requested puzzle id:", puzzleId);

    const result = await pool.query(
      'SELECT fen, solution_moves, level FROM puzzles WHERE id = $1',
      [puzzleId]
    ); // $1 to prevent SQL injection

    // log the raw DB result
    console.log("Database result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    // log the actual row being sent back
    //console.log("Sending back puzzle:", result.rows[0]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching puzzle:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//export to neon when done