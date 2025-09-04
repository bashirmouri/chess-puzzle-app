import { useEffect, useState } from "react";
import axios from "axios";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import InstructionsModal from "./InstructionsModal";
import OutOfBoundsPage from "./OutOfBoundsPage";
import ScorePage from "./ScorePage";
import LevelScorePage from "./LevelScorePage";
import CompletionProgress from "./CompletionProgress";
import formatTime from "../utils/formatTime";
import showSolution from "../utils/showSolution";
import scoreSystem from "../utils/scoreSystem";
import { getLegalMoveSquares } from "../utils/chessUtils";
import { loadHighscore, saveHighscore } from "../utils/highscore";
import { playWrong } from "../utils/sound";
import { playCapture } from "../utils/sound";
import { playCorrect } from "../utils/sound";
import { playMove } from "../utils/sound";
import { playCheck } from "../utils/sound";

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
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [moveSquares, setMoveSquares] = useState({});
  const [animationDuration, setAnimationDuration] = useState(0); // default animation duration for a piece when solving a puzzle correctly
  const [puzzlesWithSolutionViewed, setPuzzlesWithSolutionViewed] = useState(
    new Set()
  ); //track which puzzles used hint, and not count score

  function handleMove(sourceSquare, targetSquare) {
    const gameCopy = new Chess(fen);
    let move;
    try {
      move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // auto-promote to queen
      });
    } catch (error) {
      console.error("Impossible move", error); //impossible illegal move
      playWrong();
      return false;
    }

    if (move === null) {
      console.log("Well formed illegal move:", sourceSquare, targetSquare);
      playWrong();
      return false; // case where illegal move put returns null
    }

    //setFen(gameCopy.fen()); for future use if I want to make wrong move stay

    const playerMove = move.san; // translates move into standard notation

    /*console.log(
      "Player move:",
      playerMove,
      "Expected move:",
      solutionMoves[currentStep]
    ); shows correct move in console*/
    // remove this during export

    if (playerMove === solutionMoves[currentStep]) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // last correct move
      if (nextStep === solutionMoves.length) {
        const newFen = gameCopy.fen();
        setFen(newFen); //  Update fen for board to re-render

        // sound
        playCorrect();

        // Calculate score only if puzzle not completed yet
        if (
          !completedPuzzles.has(puzzleId) &&
          !puzzlesWithSolutionViewed.has(puzzleId)
        ) {
          const points = scoreSystem(time, tries, streak);

          //solved perfectly
          if (tries === 0) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            setBestStreak((prev) => Math.max(prev, newStreak)); // Track best streak
            setBestLevelStreak((prev) => Math.max(prev, newStreak)); // Track best streak in current level
          }

          setScore((prev) => prev + points);
          setLevelscore((prev) => prev + points);
          setCompletedPuzzles((prev) => new Set([...prev, puzzleId]));
          setNumPuzzlesSolvedLevel((prev) => prev + 1);
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

      if (gameCopy.inCheck()) {
        playCheck();
      } else if (move.captured) {
        playCapture();
      } else {
        playMove();
      }

      //Opponent turn (more than one correct move)
      const opponentMoves = gameCopy.moves({ verbose: true });
      if (opponentMoves.length > 0) {
        setTimeout(() => {
          const moveObj = opponentMoves[0]; // first legal move
          gameCopy.move(moveObj);

          if (moveObj.captured) {
            playCapture();
          } else {
            playMove();
          }
          setFen(gameCopy.fen());
        }, 850);
      }

      setFen(gameCopy.fen());
      return true;
    } else {
      // Wrong move (illegal move is a different case)
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
      playWrong();
      //alert("Incorrect move. Try again!");
      return false;
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    handleMove(sourceSquare, targetSquare);
    setAnimationDuration(225);
  }

  // Single onSquareClick handler
  const onSquareClick = (square) => {
    // If user clicks the same square again, deselect it
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setMoveSquares({}); // remove highlights
      return;
    }

    // If a piece is already selected, try to move it
    if (selectedSquare) {
      setAnimationDuration(300); 
      handleMove(selectedSquare, square);
      setSelectedSquare(null); // deselect after trying move
      setMoveSquares({}); // remove highlights after move
      return;
    }

    // If no piece selected yet, and the clicked square has a piece
    const game = new Chess(fen);
    if (game.get(square)) {
      setSelectedSquare(square);
      setMoveSquares(getLegalMoveSquares(fen, square)); // highlight legal moves
    }
  };

  function onPieceDragBegin(piece, sourceSquare) {
  const game = new Chess(fen);
  if (game.get(sourceSquare)) {
    setSelectedSquare(sourceSquare);
    setMoveSquares(getLegalMoveSquares(fen, sourceSquare)); // highlight legal moves
  }
  }

  const goToNextCombination = () => {
    if (puzzleId % 10 === 0 && puzzleId !== 50) {
      // Completed a full level
      setShowLevelScorePage(true); // show level score page then increment so condition does not stay true
    } else if (puzzleId === 50) {
      setTotalTime((prev) => prev + time);
      setShowScorePage(true);
    }
    setTotalTime((prev) => prev + time);
    setpuzzleId((prev) => prev + 1);
  };

  const goToPreviousCombination = () => {
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

  //move all functions to another folder for better organization later

  useEffect(() => {
    setPuzzleNotFound(false); // Reset on puzzle change
    setPuzzleTransitioning(false);
    axios
      .get(`${import.meta.env.VITE_APP_API_URL}/api/puzzle/today/${puzzleId}`)
      .then((res) => {
        //console.log("API response:", res.data);

        // Check if database returned empty array
        if (Array.isArray(res.data) && res.data.length === 0) {
          setPuzzleNotFound(true);
          setLoading(false);
          return;
        }

        // Normal puzzle loading
        console.log("Env vars:", import.meta.env.VITE_APP_API_URL);


        setFen(res.data.fen);
        setSolutionMoves(res.data.solution_moves);
        setCurrentStep(0);
        setSolution(res.data.solution_move);
        setLevel(res.data.level);
        setLoading(false);
        setSelectedSquare(null);
        setMoveSquares({});
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
    setHighscore(loadHighscore());
  }, []);

  if (score > highscore) {
    setHighscore(score);
    saveHighscore(score);
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
        level={level}
        levelscore={levelscore}
        totalTime={formatTime(totalTime)}
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
          //border: "2px solid red",
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

      <CompletionProgress puzzleId={puzzleId} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          //border: "2px solid green",
          width: "100%", // makes it stretch to full screen
        }}
      >
        <div
          style={{
            //border: "2px solid red",
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
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            onPieceDragBegin={onPieceDragBegin}
            customSquareStyles={moveSquares}
            boardWidth={500}
            animationDuration={animationDuration}
            customDarkSquareStyle={{ backgroundColor: "#5c907bff" }}
            customLightSquareStyle={{ backgroundColor: "#d9f0e1" }}
            customBoardStyle={{
              borderRadius: "10px",
              boxShadow: "0 50px 20px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        <div
          style={{
            //border: "2px solid red",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={() =>
              showSolution(
                solutionMoves,
                puzzleId,
                setPuzzlesWithSolutionViewed,
                setStreak
              )
            }
            style={{
              alignSelf: "flex-end",
              color: "#0c163aff",
              backgroundColor: "#24769fff",
              opacity: puzzleTransitioning ? 0.3 : 1,
              pointerEvents: puzzleTransitioning ? "none" : "auto",
              transition: "opacity 0.3s ease",
              fontWeight: "bold",
              padding: "7px 15px",
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
          top: "25%",
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
