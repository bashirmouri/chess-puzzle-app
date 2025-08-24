import { Routes, Route, Navigate } from "react-router-dom";
import InstructionsModal from "./components/InstructionsModal";
import OutOfBoundsPage from "./components/OutOfBoundsPage";
import PuzzlePage from "./components/PuzzlePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PuzzlePage />} />  
      <Route path="/out-of-bounds" element={<OutOfBoundsPage />} />
    </Routes>
  );
}

export default App;
