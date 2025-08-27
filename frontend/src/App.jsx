import { Routes, Route, Navigate } from "react-router-dom";
import OutOfBoundsPage from "./components/OutOfBoundsPage";
import PuzzlePage from "./components/PuzzlePage";
import LevelScorePage from "./components/LevelScorePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PuzzlePage />} />  
      <Route path="/out-of-bounds" element={<OutOfBoundsPage />} />
      <Route path="/level-score" element={<LevelScorePage />} />
    </Routes>
  );
}

export default App;
