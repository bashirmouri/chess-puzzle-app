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
  const [puzzleId, setpuzzleId] = useState(1);
  const [time, setTime] = useState(0);
  const [tries, setTries] = useState(0);
  const [solutionMoves, setSolutionMoves] = useState([]); // for full sequence
  const [level, setLevel] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0); // which move we're expecting next
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0); // optional streak system

  // Add scoreboard with streaks !!!

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = new Chess(fen);
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // auto-promote to queen
    });

    if (move === null) {
        const audio = new Audio("/capture.mp3"); // try to fix sound when illegal
        audio.play().catch((err) => console.warn("Audio blocked:", err));
        return false; // illegal move
    }
    
     

    //setFen(gameCopy.fen()); for future use if I want to make wrong move stay

    const playerMove = move.san; // translates move into standard notation

    console.log(
      "Player move:",
      playerMove,
      "Expected move:",
      solutionMoves[currentStep]
    );
    // remove this during export

    if (playerMove === solutionMoves[currentStep]) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // last correct move
      if (nextStep === solutionMoves.length) {
        const newFen = gameCopy.fen();
        setFen(newFen); //  Update fen for board to re-render

        // sound
        const audio = new Audio("/puzzle_correct.mp3");
        audio.play().catch((err) => console.warn("Audio blocked:", err));

        // Calculate score
        let points = 100; // base points
        points -= tries * 10; // penalty for mistakes

        if (time < 5) points += 50;
        else if (time < 10) points += 30;
        else if (time < 15) points += 20;
        else if (time < 30) points += 10;

        if (tries === 0) {
          setStreak((prev) => prev + 1);
          points += streak * 20; // streak bonus grows
        } 

        setScore((prev) => prev + points);

        setTimeout(() => {
          goToNextCombination();
          setTries(0);
          setTime(0);
          setCurrentStep(0);
        }, 1000); // wait 1 second for sound effect to play

        return true;
      }

      if (move.captured) {
        const audio = new Audio("/capture.mp3");
        audio.play().catch((err) => console.warn("Audio blocked:", err));
      } else {
        const audio = new Audio("/move-self.mp3");
        audio.play().catch((err) => console.warn("Audio blocked:", err));
      }
      const opponentMoves = gameCopy.moves({ verbose: true });
      if (opponentMoves.length > 0) {
        setTimeout(() => {
          const moveObj = opponentMoves[0]; // first legal move
          gameCopy.move(moveObj);

          if (moveObj.captured) {
            const audio = new Audio("/capture.mp3");
            audio.play().catch((err) => console.warn("Audio blocked:", err));
          } else {
            const audio = new Audio("/move-self.mp3");
            audio.play().catch((err) => console.warn("Audio blocked:", err));
          }
          setFen(gameCopy.fen());
        }, 850);
      }

      setFen(gameCopy.fen());
      return true;
    } else {
      setTries((prev) => prev + 1);     
      setStreak(0); 
        
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
    setpuzzleId((prev) => prev + 1);
  };

  const goToPreviousCombination = () => {
    setpuzzleId((prev) => prev - 1);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/puzzle/today/${puzzleId}`)
      .then((res) => {
        // response from server
        console.log("API response FEN:", res.data.fen); //check fen
        setFen(res.data.fen);
        setSolutionMoves(res.data.solution_moves);
        setCurrentStep(0);
        setSolution(res.data.solution_move);
        setLevel(res.data.level);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load puzzle.");
        setLoading(false);
      });
  }, [puzzleId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1); //increments time by 1
    }, 1000); //every 1 sec
    return () => clearInterval(interval);
  }, [puzzleId]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        border: "2px solid red",
        height: "100vh",
        width: "100vw",
        backgroundImage: "url(background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        justifyContent: "space-around",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      {/* Top Stats Row */}
      <div
        style={{
          border: "2px solid red",
          display: "flex",
          justifyContent: "space-evenly", // Spreads items across full width
          alignItems: "center",
          width: "100%", // Ensure full width for spacing
          marginBottom: "30px",
          gap: "20px", // Minimum gap between items
        }}
      >
        {/* Time Container */}
        <div
          style={{
            backgroundColor: "#5e3a20ff",
            padding: "15px 25px",
            borderRadius: "15px",
            color: "#fdc298ff",
            fontWeight: "bold",
            fontSize: "18px",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          Time: {formatTime(time)}
        </div>

        {/* Streak */}
        <div
          style={{
            backgroundColor: streak > 0 ? "#e1440bff" : "#5e3a20ff",
            minWidth: "100px",
            height: "60px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow:
              streak > 0 ? "0px 0px 15px 5px rgba(205, 59, 7, 0.66)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          Streak: {streak}
        </div>

        {/* Score */}
        <div
          style={{
            backgroundColor: "#9158e5ff",
            minWidth: "120px",
            height: "60px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#401c02ff",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0px 0px 20px 5px rgba(71, 27, 129, 0.7)",
            transition: "all 0.3s ease",
          }}
        >
          Score: {score}
        </div>

        {/* Number of Tries */}
        <div
          style={{
            backgroundColor: "#5e3a20ff",
            padding: "15px 25px",
            borderRadius: "15px",
            color: "#fdc298ff",
            fontWeight: "bold",
            fontSize: "18px",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          Tries: {tries}
        </div>

        <div
          style={{
            backgroundColor: "#5e3a20ff",
            padding: "15px 25px",
            borderRadius: "15px",
            color: "#fdc298ff",
            fontWeight: "bold",
            fontSize: "18px",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          Level: {level}
        </div>

        {/* Puzzle Number */}
        <div
          style={{
            backgroundColor: "#5e3a20ff",
            padding: "15px 25px",
            borderRadius: "15px",
            color: "#fdc298ff",
            fontWeight: "bold",
            fontSize: "18px",
            flexShrink: 0, // Prevent shrinking
          }}
        >
          Puzzle: {puzzleId}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          border: "2px solid green",
          width: "100%", // makes it stretch to full screen
        }}
      >
        <div
          style={{
            border: "2px solid red",
            display: "flex", // align self works only for one child in flexbox
          }}
        >
          <button
            onClick={goToPreviousCombination}
            style={{
              alignSelf: "flex-end",
              color: "#5e3a20ff",
              backgroundColor: "#fdc298ff",
              fontWeight: "bold",
            }}
          >
            Previous
          </button>
        </div>
        {/* Chessboard area - this will take remaining space */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
        </div>

        <div
          style={{
            border: "2px solid red",
            display: "flex",
          }}
        >
          <button
            onClick={goToNextCombination}
            style={{
              alignSelf: "flex-end",
              color: "#5e3a20ff",
              backgroundColor: "#fdc298ff",
              fontWeight: "bold",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
