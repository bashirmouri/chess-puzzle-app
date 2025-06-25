import { useEffect, useState } from "react";
import axios from "axios";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

function App() {
  const [fen, setFen] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [game, setGame] = useState(new Chess());
  const [solution, setSolution] = useState("");
  const [numberOfRow, setNumberOfRow] = useState(0);
  const [time, setTime] = useState(0);
  const [tries, setTries] = useState(0);
  const [solutionMoves, setSolutionMoves] = useState([]); // full sequence
  const [currentStep, setCurrentStep] = useState(0); // which move we're expecting next


  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(fen);
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // auto-promote to queen
    });

    if (move === null) return false; // illegal move

    //setFen(gameCopy.fen()); for future use if I want to make wrong move stay

    const playerMove = move.san;
    
    console.log("Player move:", playerMove, "Expected move:", solutionMoves[currentStep]);

    if (playerMove === solutionMoves[currentStep]) {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
      
      // last correct move
      if (nextStep === solutionMoves.length) {

      const newFen = gameCopy.fen();
      setFen(newFen); // ✅ Update FEN for board to re-render
      
      // sound
      const audio = new Audio("/puzzle_correct.mp3");
      audio.play().catch((err) => console.warn("Audio blocked:", err));
      
      setTimeout(() => {
        goToNextCombination();
        setTries(0);
        setTime(0);
        setCurrentStep(0);
      }, 1000); // wait 1 second for sound effect to play


      return true;
    }
    const opponentMoves = gameCopy.moves();
    if (opponentMoves.length > 0) {
      setTimeout(() => {
      gameCopy.move(opponentMoves[0]);
      setFen(gameCopy.fen()); 
      }, 600); // basic: just pick first legal move
    }

    setFen(gameCopy.fen());
    return true;
  
    } 

    else {
      setTries((prev) => prev + 1);

      //sound
      const audio = new Audio("/wrong_sound.wav");
      audio.play().catch((err) => console.warn("Audio blocked:", err));
      //alert("Incorrect move. Try again!");
      return false;
    }
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  const goToNextCombination = () => {
    setNumberOfRow((prev) => prev + 1);
  };

  const goToPreviousCombination = () => {
    setNumberOfRow((prev) => prev - 1);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/puzzle/today/${numberOfRow}`)
      .then((res) => {
        console.log("API response FEN:", res.data.fen); //check fen
        setFen(res.data.fen);
        setSolutionMoves(res.data.solution_moves);
        setCurrentStep(0);
        setSolution(res.data.solution_move);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load puzzle.");
        setLoading(false);
      });
  }, [numberOfRow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [numberOfRow]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold">Puzzle Rush</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Puzzle Section */}
      <div className="backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] w-[400px]">
            <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mb-4"></div>
            <p className="text-lg">Loading puzzle...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] w-[400px]">
            <div className="text-red-400 text-6xl mb-4">⚠</div>
            <p className="text-lg">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            {/* Chessboard */}
            <div className="flex justify-center">
              <div style={{ width: "500px", height: "500px" }}>
                <Chessboard
                  position={fen}
                  onPieceDrop={onDrop}
                  boardWidth={500}
                />
              </div>
            </div>

            {/* Instructions */}
            <h2 className="text-xl font-semibold text-center">
              Find the Best Move
            </h2>

            {/* Buttons */}
            <div className="flex flex-row justify-between items-center w-full max-w-[500px] mx-auto px-4">
              <button
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/30 hover:border-white/50"
                onClick={goToPreviousCombination}
              >
                Previous
              </button>
              <button
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/30 hover:border-white/50"
                onClick={goToNextCombination}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="py-8 px-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="flex flex-wrap justify-center gap-6 text-center">
          <div className="flex-1 min-w-[200px] max-w-[240px] bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold mb-2">{formatTime(time)}</div>
            <div className="text-slate-300">Time</div>
          </div>
          <div className="flex-1 min-w-[200px] max-w-[240px] bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold mb-2">{tries}</div>
            <div className="text-slate-300">Number of Tries</div>
          </div>
          <div className="flex-1 min-w-[200px] max-w-[240px] bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold mb-2">{numberOfRow + 1}</div>
            <div className="text-slate-300">Puzzle Number</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
