import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chessboard } from 'react-chessboard';

function App() {
  const [fen, setFen] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/puzzle/today')
      .then(res => {
        setFen(res.data.fen);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load puzzle');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Daily Chess Puzzle
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Challenge yourself with today's carefully selected chess puzzle. Find the best move and sharpen your tactical skills.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-96 w-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                <p className="text-white text-lg">Loading puzzle...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-96 w-96">
                <div className="text-red-400 text-6xl mb-4">⚠</div>
                <p className="text-white text-lg">{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Puzzle Info */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-white font-medium">
                    <span className="text-yellow-400">★</span>
                    Today's Challenge
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>

                {/* Chessboard Container */}
                <div className="flex justify-center">
                  <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white/30">
                    <Chessboard 
                      position={fen} 
                      boardWidth={400}
                      customBoardStyle={{
                        borderRadius: '0px',
                      }}
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold text-white">
                    Find the Best Move
                  </h3>
                  <p className="text-slate-300 max-w-md">
                    Analyze the position and find the strongest continuation. Look for tactical patterns and calculate variations carefully.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Submit Solution
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50">
                    Get Hint
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">1,247</div>
            <div className="text-slate-400">Puzzles Solved</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">87%</div>
            <div className="text-slate-400">Success Rate</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">42</div>
            <div className="text-slate-400">Day Streak</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
