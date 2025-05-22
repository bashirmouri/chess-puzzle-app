import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chessboard } from 'react-chessboard';

function App() {
  const [fen, setFen] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/puzzle/today')
      .then(res => setFen(res.data.fen));
  }, []);

  return (
    <div>
      <h1>Daily Chess Puzzle</h1>
      <Chessboard position={fen} />
    </div>
  );
}

export default App;
