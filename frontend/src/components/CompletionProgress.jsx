const CompletionProgress = ({ puzzleId=1 }) => {
  if (puzzleId < 0) puzzleId = 0; // Ensure non-negative
  const puzzlesPerLevel = 10;
  const indexInLevel = ((puzzleId - 1) % puzzlesPerLevel); // 0..9
  const progressPercentage = ((indexInLevel) / puzzlesPerLevel) * 100;


  return (
    <div
      style={{
        width: "100%",
        height: "6px",
        backgroundColor: "#b18489ff",
        position: "relative",
        borderRadius: "3px",
        marginBottom: "15px", // change depending on localhost or vercel
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progressPercentage}%`,
          backgroundColor: "#23beb3ff",
          borderRadius: "3px",
          transition: "width 0.3s ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${progressPercentage}%`,
          top: "-12px",
          transform: "translateX(-50%)",
          fontSize: "20px",
          color: "#2e4c3eff",
          lineHeight: "1",
        }}
      >
        ♞
      </div>
    </div>
  );
};

export default CompletionProgress;