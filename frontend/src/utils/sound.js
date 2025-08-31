function play(path) {
  const audio = new Audio(path);
  audio.play().catch(err => console.warn("Audio blocked:", err));
}

export const playMove = () => play("/move-self.mp3");
export const playCapture = () => play("/capture.mp3");     // change if needed
export const playCorrect = () => play("/puzzle_correct.mp3");
export const playWrong = () => play("/wrong_sound.wav");
