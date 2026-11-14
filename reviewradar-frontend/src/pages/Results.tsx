
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold" }}>
          Review Analysis Results
        </h1>

        <p style={{ color: "#64748b" }}>
          Here is the result of your customer review analysis.
        </p>

        <div
          style={{
            background: "white",
            padding: "25px",
            marginTop: "25px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
            Analysis Summary
          </h2>

          {result ? (
            <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <p style={{ color: "#64748b" }}>
              No analysis results available yet. Please analyze a review first.
            </p>
          )}
        </div>

        <button
          onClick={() => navigate("/analyze")}
          style={{
            marginTop: "25px",
            padding: "12px 22px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Analyze Another Review
        </button>
      </div>
    </div>
  );
}
