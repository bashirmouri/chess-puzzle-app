import { useEffect, useState } from "react";
import axios from "axios";
import { Chessboard } from "react-chessboard";

function App() {
  const [fen, setFen] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/puzzle/today")
      .then((res) => {
        setFen(res.data.fen);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load puzzle.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold">Daily Chess Puzzle</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Main Puzzle Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl">
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
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full font-medium">
                  <span className="text-yellow-400">★</span>
                  Today's Challenge
                  <span className="text-yellow-400">★</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border-4 border-white/20 mb-6">
                <Chessboard
                  position={fen}
                  boardWidth={400}
                  customBoardStyle={{ borderRadius: "0" }}
                />
              </div>

              <h2 className="text-xl font-semibold text-center mb-4">
                Find the Best Move
              </h2>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1">
                  Submit Solution
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/30 hover:border-white/50">
                  Get Hint
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 px-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
        <div className="flex flex-wrap justify-center gap-6 text-center">
          <div className="flex-1 min-w-[200px] max-w-[240px] bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold mb-2">1,247</div>
            <div className="text-slate-300">Puzzles Solved</div>
          </div>
          <div className="flex-1 min-w-[200px] max-w-[240px] bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold mb-2">87%</div>
            <div className="text-slate-300">Success Rate</div>
          </div>
          <div className="flex-1 min-w-[200px] max-w-[240px] bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold mb-2">42</div>
            <div className="text-slate-300">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
