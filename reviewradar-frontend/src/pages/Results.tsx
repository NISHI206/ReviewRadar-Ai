

import { useLocation, useNavigate } from "react-router-dom";
import type { ReviewAnalysis } from "../services/api";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result as ReviewAnalysis | undefined;

  if (!result) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>No analysis results found</h2>
        <p>Please analyze a review first.</p>
        <button onClick={() => navigate("/analyze")}>
          Analyze a Review
        </button>
      </div>
    );
  }

  const confidence =
    result.confidence <= 1
      ? result.confidence * 100
      : result.confidence;

  const positive = result.sentiment === "Positive";

  const cardStyle: React.CSSProperties = {
    background: "white",
    padding: "22px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    marginBottom: "18px",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "19px",
    fontWeight: 700,
    marginBottom: "14px",
    color: "#1e293b",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "35px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        <button
          onClick={() => navigate("/analyze")}
          style={{
            border: "none",
            background: "transparent",
            color: "#6d28d9",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "15px",
          }}
        >
          ← Analyze another review
        </button>

        <h1 style={{ fontSize: "30px", color: "#1e293b" }}>
          Review Analysis Results
        </h1>

        <p style={{ color: "#64748b", marginBottom: "25px" }}>
          Here's what our AI found in your customer review.
        </p>

        <div style={cardStyle}>
          <p style={{ color: "#64748b" }}>Overall Sentiment</p>

          <h2
            style={{
              color: positive ? "#15803d" : "#dc2626",
              fontSize: "28px",
              margin: "10px 0",
            }}
          >
            {result.sentiment}
          </h2>

          <p style={{ color: "#64748b" }}>
            Confidence: {confidence.toFixed(1)}%
          </p>

          <div
            style={{
              height: "9px",
              background: "#e2e8f0",
              borderRadius: "10px",
              overflow: "hidden",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, confidence))}%`,
                height: "100%",
                background: positive ? "#16a34a" : "#dc2626",
              }}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={headingStyle}>Business & Review</h2>
          <p><strong>Business:</strong> {result.business_name || "Not specified"}</p>
          <p style={{ marginTop: "12px", color: "#475569" }}>
            {result.review}
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={headingStyle}>AI Summary</h2>
          <p style={{ color: "#475569", lineHeight: 1.7 }}>
            {result.summary}
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={headingStyle}>Aspect Analysis</h2>

          {result.aspects?.length ? (
            result.aspects.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "14px 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <strong>{item.aspect}</strong>
                <p style={{ margin: "6px 0", color: "#64748b" }}>
                  {item.reason}
                </p>
                <span
                  style={{
                    color:
                      item.sentiment === "Positive"
                        ? "#15803d"
                        : item.sentiment === "Negative"
                        ? "#dc2626"
                        : "#64748b",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  {item.sentiment}
                </span>
              </div>
            ))
          ) : (
            <p>No aspect analysis available.</p>
          )}
        </div>

        {[
          { title: "Key Issues", items: result.key_issues },
          { title: "Positive Points", items: result.positive_points },
          { title: "Recommendations", items: result.recommendations },
        ].map((section) => (
          <div style={cardStyle} key={section.title}>
            <h2 style={headingStyle}>{section.title}</h2>

            {section.items?.length ? (
              <ul style={{ paddingLeft: "22px", color: "#475569" }}>
                {section.items.map((item, index) => (
                  <li key={index} style={{ marginBottom: "10px" }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#64748b" }}>No data available.</p>
            )}
          </div>
        ))}

        <button
          onClick={() => navigate("/analyze")}
          style={{
            background: "#6d28d9",
            color: "white",
            padding: "13px 22px",
            border: "none",
            borderRadius: "9px",
            cursor: "pointer",
            fontSize: "15px",
            marginTop: "5px",
          }}
        >
          Analyze Another Review
        </button>
      </div>
    </div>
  );
}
