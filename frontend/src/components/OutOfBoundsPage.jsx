import React from "react";

const OutOfBoundsPage = ({ onGoHome }) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url(background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow: "hidden",
      }}
    >
      {/* Main Error Container */}
      <div
        style={{
          backgroundColor: "#5e3a20ff",
          padding: "40px 60px",
          borderRadius: "20px",
          textAlign: "center",
          boxShadow: "0px 0px 30px 10px rgba(94, 58, 32, 0.8)",
          border: "3px solid #fdc298ff",
          maxWidth: "600px",
        }}
      >
        {/* Large Chess Piece Icon (King falling over) */}
        <div
          style={{
            fontSize: "80px",
            marginBottom: "20px",
            display: "inline-block",
          }}
        >
          ♔
        </div>

        {/* Main Error Message */}
        <h1
          style={{
            color: "#fdc298ff",
            fontSize: "48px",
            fontWeight: "bold",
            margin: "20px 0",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          ERROR 404
        </h1>

        <h2
          style={{
            color: "#e1440bff",
            fontSize: "32px",
            fontWeight: "bold",
            margin: "20px 0",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Nothing to Checkmate Here!
        </h2>

        <p
          style={{
            color: "#fdc298ff",
            fontSize: "18px",
            margin: "20px 0",
            lineHeight: "1.5",
          }}
        >
          Looks like this puzzle has escaped the board! 
          <br />
          The page you're looking for doesn't exist.
        </p>


        {/* Action Buttons */}
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
            onClick={onGoHome}
            style={{
              backgroundColor: "#fdc298ff",
              color: "#5e3a20ff",
              fontWeight: "bold",
              fontSize: "18px",
              padding: "15px 30px",
              borderRadius: "15px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e1440bff";
              e.target.style.color = "#fff";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#fdc298ff";
              e.target.style.color = "#5e3a20ff";
              e.target.style.transform = "translateY(0px)";
            }}
          >
             Return to Game
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
          top: "20%",
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
          bottom: "10%",
          right: "10%",
          fontSize: "55px",
          opacity: "0.3",
          transform: "rotate(-45deg)",
        }}
      >
        ♗
      </div>
    </div>
  );
};

export default OutOfBoundsPage;