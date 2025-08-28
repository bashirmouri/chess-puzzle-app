const CompletionProgress = ({ completed }) => {
  if (completed < 0) completed = 0; // Ensure non-negative
  const progressPercentage = (completed / 10) * 100;

  return (
    <div
      style={{
        width: "100%",
        height: "6px",
        backgroundColor: "#e0e0e0",
        position: "relative",
        marginBottom: "15px",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progressPercentage}%`,
          backgroundColor: "#23beb3ff",
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
          color: "#476155ff",
          lineHeight: "1",
        }}
      >
        ♞
      </div>
    </div>
  );
};

export default CompletionProgress;