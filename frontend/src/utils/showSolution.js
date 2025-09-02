  const showSolution = (solutionMoves, puzzleId, setPuzzlesWithSolutionViewed, setStreak) => {
    const pieceNames = {
      K: "King",
      Q: "Queen",
      R: "Rook",
      B: "Bishop",
      N: "Knight",
    };

    const explainSAN = (original) => {
      let san = original;

      // note: check/checkmate
      let note = "";
      if (san.endsWith("#")) {
        note = " (checkmate)";
        san = san.slice(0, -1);
      } else if (san.endsWith("+")) {
        note = " (check)";
        san = san.slice(0, -1);
      }


      // Piece (default = Pawn)
      let piece = "Pawn";
      if (pieceNames[san[0]]) {
        piece = pieceNames[san[0]];
        san = san.slice(1);
      }

      // Promotion
      let promoTo = "";
      const promoMatch = san.match(/=([KQRBN])/);
      if (promoMatch) promoTo = pieceNames[promoMatch[1]];

      // Target square (first occurrence like "e4")
      const squareMatch = san.match(/([a-h][1-8])/);
      const square = squareMatch ? squareMatch[1] : "";

      const isCapture = san.includes("x");

      if (isCapture) {
        if (promoTo)
          return `${piece} captures on ${square} and promotes to ${promoTo}${enPassant}${note}`;
        return `${piece} captures on ${square}${enPassant}${note}`;
      } else {
        if (promoTo)
          return `${piece} promotes to ${promoTo} on ${square}${note}`;
        return `${piece} moves to ${square}${note}`;
      }
    };

    const explainedMoves = solutionMoves.map(explainSAN);
    alert(`Solution:\n${explainedMoves.join(" → ")}`);

    setPuzzlesWithSolutionViewed((prev) => new Set([...prev, puzzleId]));
    setStreak(0);
  };

  export default showSolution;