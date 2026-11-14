
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getReviews, type ReviewAnalysis } from "../services/api";

type FilterType = "All" | "Positive" | "Negative";

export default function ReviewHistory() {
  const [reviews, setReviews] = useState<ReviewAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("All");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReviews(50);
      setReviews(data.reviews || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load review history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      (review.business_name || "").toLowerCase().includes(search.toLowerCase()) ||
      review.review.toLowerCase().includes(search.toLowerCase()) ||
      review.summary.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || review.sentiment === filter;

    return matchesSearch && matchesFilter;
  });

  const filterButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: "9px 18px",
    borderRadius: "8px",
    border: "1px solid #6d28d9",
    background: active ? "#6d28d9" : "#ffffff",
    color: active ? "#ffffff" : "#6d28d9",
    cursor: "pointer",
    fontWeight: 600,
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px 22px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Link
          to="/dashboard"
          style={{ color: "#64748b", textDecoration: "none" }}
        >
          ← Back to Dashboard
        </Link>

        <h1 style={{ color: "#0f172a", marginTop: "24px" }}>
          Review History
        </h1>

        <p style={{ color: "#64748b", marginBottom: "28px" }}>
          View and manage all the reviews analyzed for your business.
        </p>

        {!loading && !error && (
          <>
            <input
              type="text"
              placeholder="Search by business, review or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                border: "1px solid #cbd5e1",
                borderRadius: "9px",
                fontSize: "15px",
                marginBottom: "18px",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "24px",
              }}
            >
              {(["All", "Positive", "Negative"] as FilterType[]).map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    style={filterButtonStyle(filter === item)}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </>
        )}

        {loading && <p>Loading review history...</p>}

        {!loading && error && (
          <div
            style={{
              background: "#fee2e2",
              padding: "16px",
              borderRadius: "10px",
            }}
          >
            <p>{error}</p>
            <button onClick={fetchReviews}>Retry</button>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "28px",
              borderRadius: "12px",
            }}
          >
            <h2>No reviews yet</h2>
            <p>Your analyzed reviews will appear here.</p>
            <Link to="/analyze">Analyze your first review →</Link>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <>
            <p style={{ color: "#64748b", marginBottom: "16px" }}>
              Showing {filteredReviews.length} of {reviews.length} reviews
            </p>

            {filteredReviews.length > 0 ? (
              <div style={{ display: "grid", gap: "16px" }}>
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      background: "white",
                      padding: "22px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3 style={{ margin: 0, color: "#0f172a" }}>
                        {review.business_name || "Unknown Business"}
                      </h3>

                      <strong
                        style={{
                          color:
                            review.sentiment === "Positive"
                              ? "#15803d"
                              : "#dc2626",
                        }}
                      >
                        {review.sentiment}
                      </strong>
                    </div>

                    <p style={{ color: "#475569", lineHeight: 1.6 }}>
                      {review.review}
                    </p>

                    <p style={{ color: "#64748b", fontSize: "14px" }}>
                      Confidence: {Math.round(review.confidence * 100)}%
                    </p>

                    <p style={{ color: "#334155" }}>
                      <strong>Summary:</strong> {review.summary}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  color: "#64748b",
                }}
              >
                No reviews match your search or selected filter.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

