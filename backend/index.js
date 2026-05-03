const express = require('express');
const cors = require('cors');
const supabase = require('./db');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173", // Vite default dev server port
    "https://chess-puzzle-app-five.vercel.app" // Hosted frontend
  ]
}));

app.use(express.json());

const logDbError = (err) => {
  console.error("DB error:", {
    message: err.message,
    code: err.code,
    detail: err.details,
    hint: err.hint,
  });
};

(async () => {
  const { error } = await supabase
    .from('puzzles')
    .select('id', { head: true })
    .limit(1);

  if (error) {
    console.error("DB connection failed");
    logDbError(error);
    return;
  }

  console.log("DB connected");
})();

  app.get('/api/puzzle/today/:puzzleId', async (req, res) => { 
  const puzzleId = req.params.puzzleId; // this is the puzzle id
  try {
    //console.log("Requested puzzle id:", puzzleId);

    const { data, error } = await supabase
      .from('puzzles')
      .select('fen, solution_moves, level')
      .eq('id', puzzleId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Puzzle not found' });
      }
      logDbError(error);
      return res.status(500).json({ error: 'Server error' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching puzzle:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  //console.log(`Server running on port ${PORT}`);
});


//export to neon when done