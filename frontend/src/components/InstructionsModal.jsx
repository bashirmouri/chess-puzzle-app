function InstructionsModal({ onClose, isMobile }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isMobile ? "50vw" : "100vw",
        height: isMobile ? "50vh" : "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "5px",
      }}
    >
      <div
        style={{
          background: "#e7ab80ff",
          padding: "25px",
          borderRadius: "20px",
          color: "#333",
          width: "420px",
          textAlign: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: "15px",
            border: "2px solid #5e3a20",
            borderRadius: "12px",
            backgroundColor: "#6fef95ff",
            display: "inline-block", // keeps the box fit around the text
            marginBottom: "12px",
          }}
        >
          <h2 style={{ marginBottom: 0, color: "#5e3a20" }}>
            <b>Welcome to GoChess!</b>
          </h2>
        </div>

        {/* Levels */}
        <div
          style={{
            background: "#f0cbb0",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        >
          You play as <b>White</b> <br /><b>5 Levels</b> - - - each with <b>10 puzzles</b>
        </div>

        {/* Base Points */}
        <div
          style={{
            background: "#ffe4c4",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        >
          Each puzzle is worth <b>100 points</b>
        </div>

        {/* Penalty */}
        <div
          style={{
            background: "#fdd9d9",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        >
          Every wrong move: <b>-50 points</b>
        </div>

        {/* Bonus */}
        <div
          style={{
            background: "#d6f5d6",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        >
          <b style={{ marginLeft: "0" }}>Time Bonus:</b>
          <ul
            style={{
              margin: "5px 0 0 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              listStyle: "none", // Removes the dots
              paddingLeft: "0", // Removes default left padding
            }}
          >
            <li>
              Under 5s → <b>+50 points</b>
            </li>
            <li>
              Under 10s → <b>+30 points</b>
            </li>
            <li>
              Under 15s → <b>+20 points</b>
            </li>
            <li>
              Under 30s → <b>+10 points</b>
            </li>
          </ul>
        </div>

        {/* Streak */}
        <div
          style={{
            background: "#d0e6ff",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "5px",
          }}
        >
          <b>Perfect Solve!</b> <br />
          Get <b>20 points</b> multiplied by your <b>Streak</b>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          style={{
            marginTop: "5px",
            padding: "12px 25px",
            background: "#5e3a20",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#7b4b2d")}
          onMouseOut={(e) => (e.target.style.background = "#5e3a20")}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default InstructionsModal;
