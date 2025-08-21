function InstructionsModal({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "10px",
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
        <h2 style={{ marginBottom: "15px", color: "#5e3a20" }}>
          <b>Welcome to GoChess!</b>
        </h2>

        {/* Levels */}
        <div
          style={{
            background: "#f0cbb0",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        >
          <b>5 Levels</b> — each with <b>10 puzzles</b>
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
          Every wrong move: <b>-10 points</b>
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
            <li>Under 5s → +50</li>
            <li>Under 10s → +30</li>
            <li>Under 15s → +20</li>
            <li>Under 30s → +10</li>
          </ul>
        </div>

        {/* Streak */}
        <div
          style={{
            background: "#d0e6ff",
            padding: "12px",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        >
          Solve with <b>no mistakes</b> → <br />
          Streak +1 and <b>+20 × streak</b> points
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          style={{
            marginTop: "15px",
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
