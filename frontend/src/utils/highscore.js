// src/utils/highscore.js
export function loadHighscore() {
  const saved = localStorage.getItem("chessHighscore");
  return saved ? parseInt(saved, 10) : 0;
}

export function saveHighscore(score) {
  localStorage.setItem("chessHighscore", score.toString());
}
