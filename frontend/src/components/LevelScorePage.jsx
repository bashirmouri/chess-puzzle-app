import React from "react";

const LevelScorePage = ({
  score,
  level,
  levelscore,
  totalTime,
  bestLevelStreak,
  numPuzzlesSolved,
  onContinueToNextLevel,
  isMobile,
}) => {

  
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: isMobile ? "url(/background-mobile.jpeg)" : "url(/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      
      <div
        style={{
          backgroundColor: "rgba(245, 233, 218, 0.95)", 
          padding: "20px 30px",
          borderRadius: "20px",
          height: "70vh",
          width: isMobile ? "90vw" : "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "25px",
            border: `4px solid`,
            borderColor: "gold",
            backgroundColor: "#f1ddabff", 
            padding: "20px 25px",
            borderRadius: "12px",
            color: "#5a5930ff", 
          }}
        >
          Level {level-1} Completed
        </div>

        <div
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            backgroundColor: "#F5F1E3", // Neutral beige
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            columnGap: "10px",
            padding: "15px 20px",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              backgroundColor: "#3E2C1C", // Espresso
              color: "#FFF7EC", // Ivory text
              padding: "15px 20px",
              borderRadius: "12px",
            }}
          >
            Total Score: {score}
          </div>
          <div
            style={{
              backgroundColor: "#3E2C1C", // Espresso
              color: "#FFF7EC", // Ivory text
              padding: "15px 20px",
              borderRadius: "12px",
            }}
          >
            Level score: {levelscore}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#F0EBE3", // Soft beige background
            padding: isMobile ? "15px 15px" : "20px 25px",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "row",
            columnGap: "15px",
            fontWeight: "bold",
            fontSize: "25px",
          }}
        >
          <div
            style={{
              backgroundColor: "#cdcbe4ff", // Muted stone
              padding: "15px 20px",
              borderRadius: "12px",
              color: "#2C3E50", // Dark slate
            }}
          >
            Total time: {totalTime}
          </div>

          <div
            style={{
              backgroundColor: "#ffd4cbff",
              padding: "15px 20px",
              borderRadius: "12px",
              color: "#A33E2E", 
            }}
          >
            Best streak: {bestLevelStreak}
          </div>

          <div
            style={{
              backgroundColor: "#b8dbb8ff", 
              padding: "15px 20px",
              borderRadius: "12px",
              color: "#2F5233", 
            }}
          >
            Puzzles solved: {numPuzzlesSolved}/10
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "30px",
          }}
        >
          <button
            onClick={onContinueToNextLevel}
            style={{
              backgroundColor: "#3E2C1C", // Espresso
              color: "#fff0dbff", // Ivory
              fontWeight: "bold",
              fontSize: "18px",
              padding: "15px 30px",
              borderRadius: "15px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#C9A227"; // Gold hover
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#3E2C1C"; // Back to espresso
              e.target.style.transform = "translateY(0px)";
            }}
          >
            Next Level
          </button>
        </div>
      </div>

      {/* Floating Chess Pieces for Celebration */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "5%",
          fontSize: "80px",
          opacity: "0.25",
          animation: "float 3s ease-in-out infinite",
          color: "#ffffffff", // Gold
        }}
      >
        ♔
      </div>
      
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "5%",
          fontSize: "70px",
          opacity: "0.25",
          animation: "float 2.5s ease-in-out infinite reverse",
          color: "#ffffffff", // Terracotta
        }}
      >
        ♕
      </div>
      
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          left: "5%",
          fontSize: "60px",
          opacity: "0.25",
          animation: "float 2.8s ease-in-out infinite",
          color: "#ffffffff", // Forest green
        }}
      >
        ♖
      </div>
      
      <div
        style={{
          position: "absolute",
          bottom: "12%",
          right: "5%",
          fontSize: "75px",
          opacity: "0.25",
          animation: "float 3.2s ease-in-out infinite reverse",
          color: "#ffffffff", // Royal purple
        }}
      >
        ♗
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LevelScorePage;
