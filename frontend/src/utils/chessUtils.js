import { Chess } from "chess.js";

export function getLegalMoveSquares(fen, square) {
  const game = new Chess(fen);
  const moves = game.moves({ square, verbose: true }); // gets all legal moves

  if (moves.length === 0) return {}; // no legal moves

  const squares = {};
  moves.forEach((move) => {
    let background;
    //for each square piece can move to check if another piece exists
    if (game.get(move.to)){
        // capture move
        background = "radial-gradient(circle, transparent 60%, rgba(91, 133, 84, 0.7) 60%, rgba(91, 133, 84, 0.7) 85%, transparent 85%)";
    } else {
        // empty square
        background = "radial-gradient(circle, rgba(86, 99, 89, 0.4) 20%, transparent 20%)";
    }

    squares[move.to] = { background: background, borderRadius: "50%" };
  });

  // Highlight the selected piece on 'square'
  squares[square] = { background: "rgba(139, 139, 88, 0.4)" };
  //console.log(squares);
  return squares;
}
