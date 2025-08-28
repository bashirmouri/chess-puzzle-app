import { useEffect, useState } from "react";
import axios from "axios";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import InstructionsModal from "./InstructionsModal";
import OutOfBoundsPage from "./OutOfBoundsPage";
import ScorePage from "./ScorePage";
import LevelScorePage from "./LevelScorePage";
import CompletionProgress from "./CompletionProgress";

function PuzzlePage() {
  const [fen, setFen] = useState("");
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState(null);
  const [solution, setSolution] = useState("");
  const [puzzleId, setpuzzleId] = useState(1);
  const [time, setTime] = useState(0);
  const [tries, setTries] = useState(0);
  const [solutionMoves, setSolutionMoves] = useState([]); // for full sequence
  const [level, setLevel] = useState(-1);
  const [currentStep, setCurrentStep] = useState(0); // which move we're expecting next
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0); // streak system
  const [showInstructions, setShowInstructions] = useState(true);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [animateLevel, setAnimateLevel] = useState(false); // animation when going through levels
  const [puzzleNotFound, setPuzzleNotFound] = useState(false);
  const [puzzleTransitioning, setPuzzleTransitioning] = useState(false); // to avoid incrementing by 2
  const [completedPuzzles, setCompletedPuzzles] = useState(new Set());
  const [totalTime, setTotalTime] = useState(0); // Track cumulative time
  const [bestStreak, setBestStreak] = useState(0); // Track best streak achieved
  const [showScorePage, setShowScorePage] = useState(false);
  const [showLevelScorePage, setShowLevelScorePage] = useState(false);
  const [highscore, setHighscore] = useState(0); // Track highscore
  const [levelscore, setLevelscore] = useState(0); // Track level score
  const [bestLevelStreak, setBestLevelStreak] = useState(0); // Best streak in current level
  const [numPuzzlesSolvedLevel, setNumPuzzlesSolvedLevel] = useState(0); // Track number of puzzles solved
  const [puzzlesWithSolutionViewed, setPuzzlesWithSolutionViewed] = useState(
    new Set()
  );
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

        // Calculate score only if puzzle not completed yet
        if (
          !completedPuzzles.has(puzzleId) &&
          !puzzlesWithSolutionViewed.has(puzzleId)
        ) {
          let points = 100; // base points

          if (time < 5) points += 50;
          else if (time < 10) points += 30;
          else if (time < 15) points += 20;
          else if (time < 30) points += 10;

          if (tries === 0) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setBestStreak((prev) => Math.max(prev, newStreak)); // Track best streak
            setBestLevelStreak((prev) => Math.max(prev, newStreak)); // Track best streak in current level
            points += streak * 20;
          }
          setScore((prev) => prev + points);
          setLevelscore((prev) => prev + points);
          setCompletedPuzzles((prev) => new Set([...prev, puzzleId]));

          setPuzzleTransitioning(true);
        }
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
      if (score - 50 < 0) {
        setScore(0);
        setLevelscore(0);
      } else {
        setScore(score - 50); // penalty for mistakes
        setLevelscore(levelscore - 50);
      }

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
    setNumPuzzlesSolvedLevel((prev) => prev + 1);
    if (puzzleId % 10 === 0) {
      // Completed a full level
      setShowLevelScorePage(true);
    } else if (puzzleId === 51) {
      setTotalTime((prev) => prev + time);
      setShowScorePage(true);
    }

    setpuzzleId((prev) => prev + 1);
  };

  const goToPreviousCombination = () => {
    setNumPuzzlesSolvedLevel((prev) => prev - 1);

    if (puzzleId % 10 === 0) {
      setShowLevelScorePage(true);
    }
    setpuzzleId((prev) => prev - 1);
  };

  const handleGoHome = () => {
    setpuzzleId(1);
    setPuzzleNotFound(false);
  };

  const handlePlayAgain = () => {
    // Reset everything for a new game
    setpuzzleId(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotalTime(0);
    setTime(0);
    setTries(0);
    setPuzzleTransitioning(false);
    setShowScorePage(false);
  };

  const handleContinueToNextLevel = () => {
    setShowLevelScorePage(false);
    setLevelscore(0);
    setBestLevelStreak(0);
    setNumPuzzlesSolvedLevel(0);
  };

  const showSolution = () => {
    const solutionText = solutionMoves.join(" → ");
    alert(`Solution: ${solutionText}`);
    setPuzzlesWithSolutionViewed((prev) => new Set([...prev, puzzleId]));
  };

  useEffect(() => {
    setPuzzleNotFound(false); // Reset on puzzle change
    setPuzzleTransitioning(false);
    axios
      .get(`http://localhost:5000/api/puzzle/today/${puzzleId}`)
      .then((res) => {
        console.log("API response:", res.data);

        // Check if database returned empty array
        if (Array.isArray(res.data) && res.data.length === 0) {
          setPuzzleNotFound(true);
          setLoading(false);
          return;
        }

        // Normal puzzle loading
        setFen(res.data.fen);
        setSolutionMoves(res.data.solution_moves);
        setCurrentStep(0);
        setSolution(res.data.solution_move);
        setLevel(res.data.level);
        setLoading(false);
      })
      .catch((err) => {
        console.log("API error:", err.response?.status);

        // If it's a 404 error, the puzzle doesn't exist
        if (err.response?.status === 404) {
          setPuzzleNotFound(true);
        } else {
          setError("Failed to load puzzle.");
        }
        setLoading(false);
      });
  }, [puzzleId]);

  useEffect(() => {
    let timer;
    if (level !== previousLevel) {
      // Only run if level changed
      setAnimateLevel(true);

      // Turn off after 1s
      timer = setTimeout(() => setAnimateLevel(false), 1000);

      // Update previousLevel to the new one
      setPreviousLevel(level);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [level]);

  useEffect(() => {
    if (!gameStarted) {
      return;
    }
    const interval = setInterval(() => {
      setTime((prev) => prev + 1); //increments time by 1
    }, 1000); //every 1 sec
    return () => clearInterval(interval);
  }, [puzzleId, gameStarted]);

  useEffect(() => {
    if (puzzleId > 1) {
      setTotalTime((prev) => prev + time);
      setTime(0); // Reset current puzzle time
    }
  }, [puzzleId]); // Only when puzzleId changes

  useEffect(() => {
    const savedHighScore = localStorage.getItem("chesshighscore");
    if (savedHighScore) {
      setHighscore(parseInt(savedHighScore));
    }
  }, []);

  if (score > highscore) {
    setHighscore(score);
    localStorage.setItem("chessHighscore", score.toString());
  }

  if (puzzleNotFound) {
    return <OutOfBoundsPage onGoHome={handleGoHome} />;
  }

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

  if (puzzleId > 1 && showLevelScorePage) {
    return (
      <LevelScorePage
        score={score}
        levelscore={levelscore}
        totalTime={totalTime}
        bestLevelStreak={bestLevelStreak}
        numPuzzlesSolved={numPuzzlesSolvedLevel}
        onContinueToNextLevel={handleContinueToNextLevel}
      />
    );
  }

  // Show score page after completing puzzle 50
  if (showScorePage) {
    return (
      <ScorePage
        score={score}
        highscore={highscore}
        totalTime={formatTime(totalTime)}
        bestStreak={bestStreak}
        numPuzzlesSolved={completedPuzzles.size}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <div
      style={{
        //border: "2px solid red",
        height: "100vh",
        width: "100vw",
        backgroundImage: "url(/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      {showInstructions && !gameStarted && (
        <InstructionsModal
          onClose={() => {
            setShowInstructions(false);
            setGameStarted(true);
          }}
        />
      )}

      {/* Top Stats Row */}
      <div
        style={{
          border: "2px solid red",
          display: "flex",
          justifyContent: "space-evenly", // Spreads items across full width
          alignItems: "center",
          width: "100%", // Ensure full width for spacing
          marginBottom: "15px",
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
            transform: animateLevel ? "scale(1.3)" : "scale(1)",
            boxShadow: animateLevel
              ? "0 0 20px 5px rgba(129, 77, 21, 0.8)"
              : "none",
            transition: "all 0.5s ease-in-out",
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

      <CompletionProgress completed={numPuzzlesSolvedLevel} />

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
              opacity: puzzleTransitioning ? 0.3 : 1,
              pointerEvents: puzzleTransitioning ? "none" : "auto",
              transition: "opacity 0.3s ease",
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
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={showSolution}
            style={{
              alignSelf: "flex-end",
              color: "#5e3a20ff",
              backgroundColor: "#fdc298ff",
              opacity: puzzleTransitioning ? 0.3 : 1,
              pointerEvents: puzzleTransitioning ? "none" : "auto",
              transition: "opacity 0.3s ease",
              fontWeight: "bold",
              padding: "5px 20px",
            }}
          >
            Solution
          </button>
          <button
            onClick={goToNextCombination}
            style={{
              alignSelf: "flex-start",
              color: "#5e3a20ff",
              backgroundColor: "#fdc298ff",
              opacity: puzzleTransitioning ? 0.3 : 1,
              pointerEvents: puzzleTransitioning ? "none" : "auto",
              transition: "opacity 0.3s ease",
              fontWeight: "bold",
              padding: "9px 30px",
            }}
          >
            Skip
          </button>
        </div>
      </div>

      {/* Additional Chess Pieces scattered around */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          fontSize: "60px",
          opacity: "0.3",
          transform: "rotate(45deg)",
        }}
      >
        ♕
      </div>

      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "15%",
          fontSize: "50px",
          opacity: "0.3",
          transform: "rotate(-60deg)",
        }}
      >
        ♖
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "20%",
          fontSize: "70px",
          opacity: "0.3",
          transform: "rotate(20deg)",
        }}
      >
        ♘
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          fontSize: "55px",
          opacity: "0.3",
          transform: "rotate(-45deg)",
        }}
      >
        ♗
      </div>
    </div>
  );
}

export default PuzzlePage;
