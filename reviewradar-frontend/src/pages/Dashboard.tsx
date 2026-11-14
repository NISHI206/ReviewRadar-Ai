

import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getDashboardStats,
  getInsights,
  getReviews,
} from "../services/api";

type Stats = Awaited<ReturnType<typeof getDashboardStats>>;
type Insights = Awaited<ReturnType<typeof getInsights>>;
type ReviewsData = Awaited<ReturnType<typeof getReviews>>;

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.all([
        getDashboardStats(),
        getInsights(),
        getReviews(5),
      ]);

      setStats(results[0]);
      setInsights(results[1]);
      setReviews(results[2]);
    } catch {
      setError(
        "Dashboard data is currently unavailable. Connect the backend to view live analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Reviews",
      value: stats?.total_reviews,
      color: "#6d28d9",
    },
    {
      title: "Positive Reviews",
      value: stats?.positive_count,
      color: "#16a34a",
    },
    {
      title: "Negative Reviews",
      value: stats?.negative_count,
      color: "#dc2626",
    },
    {
      title: "Positive Percentage",
      value:
        stats?.positive_percentage !== undefined
          ? `${stats.positive_percentage.toFixed(1)}%`
          : undefined,
      color: "#2563eb",
    },
  ];

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    padding: "22px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "35px 22px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1150px", margin: "auto" }}>
        <Link to="/" className="home-button">
        <Home size={17} />
        Home
      </Link>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div>
            <h1 style={{ fontSize: "30px", color: "#1e293b" }}>
              ReviewRadar AI Dashboard
            </h1>
            <p style={{ color: "#64748b", marginTop: "9px" }}>
              Monitor customer feedback and understand your business performance.
            </p>
          </div>

          {/* Navigation links */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to="/history"
              style={{
                background: "#ffffff",
                color: "#6d28d9",
                padding: "12px 19px",
                borderRadius: "9px",
                textDecoration: "none",
                fontWeight: 600,
                border: "1px solid #6d28d9",
              }}
            >
              Review History
            </Link>

            <Link
              to="/analyze"
              style={{
                background: "#6d28d9",
                color: "white",
                padding: "12px 19px",
                borderRadius: "9px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              + Analyze Review
            </Link>
          </div>
        </div>

        {error && (
          <div
            style={{
              marginTop: "25px",
              padding: "15px",
              background: "#fff7ed",
              color: "#9a3412",
              borderRadius: "10px",
              border: "1px solid #fed7aa",
            }}
          >
            {error}
            <button
              onClick={loadDashboard}
              style={{
                marginLeft: "12px",
                border: "none",
                background: "transparent",
                color: "#6d28d9",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Retry
            </button>
          </div>
        )}

        <h2 style={{ margin: "35px 0 18px", color: "#1e293b" }}>
          Overview
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "18px",
          }}
        >
          {statCards.map((card) => (
            <div style={cardStyle} key={card.title}>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                {card.title}
              </p>
              <h2
                style={{
                  color: card.color,
                  fontSize: "30px",
                  marginTop: "13px",
                }}
              >
                {loading ? "..." : card.value ?? "—"}
              </h2>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ fontSize: "19px", color: "#1e293b" }}>
              Sentiment Distribution
            </h2>

            {stats ? (
              <div style={{ marginTop: "22px" }}>
                {[
                    {
                      label: "Positive",
                      value: stats.positive_percentage,
                      color: "#16a34a",
                    },
                    {
                      label: "Negative",
                      value: stats.negative_percentage,
                      color: "#dc2626",
                    },
                  ].map((item) => (
                  <div key={item.label} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        color: "#475569",
                      }}
                    >
                      <span>{item.label}</span>
                      <strong>{item.value.toFixed(1)}%</strong>
                    </div>

                    <div
                      style={{
                        height: "11px",
                        background: "#e2e8f0",
                        borderRadius: "20px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, Math.max(0, item.value))}%`,
                          height: "100%",
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8", marginTop: "20px" }}>
                {loading
                  ? "Loading analytics..."
                  : "No analytics available yet."}
              </p>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: "19px", color: "#1e293b" }}>
              Top Review Aspects
            </h2>

            {stats?.top_aspects?.length ? (
              stats.top_aspects.map((aspect) => (
                <div
                  key={aspect.aspect}
                  style={{
                    padding: "13px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <strong style={{ color: "#334155" }}>
                    {aspect.aspect}
                  </strong>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      marginTop: "6px",
                    }}
                  >
                    Positive: {aspect.positive} · Negative: {aspect.negative} ·
                    Neutral: {aspect.neutral}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: "#94a3b8", marginTop: "20px" }}>
                {loading ? "Loading aspects..." : "No aspect data available."}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ fontSize: "19px", color: "#1e293b" }}>
              Recurring Issues
            </h2>

            {insights?.recurring_issues?.length ? (
              <ul style={{ paddingLeft: "20px", color: "#475569" }}>
                {insights.recurring_issues.map((item, index) => (
                  <li key={index} style={{ marginTop: "12px" }}>
                    {item.issue} ({item.count})
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#94a3b8", marginTop: "18px" }}>
                {loading ? "Loading..." : "No recurring issues available."}
              </p>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ fontSize: "19px", color: "#1e293b" }}>
              Popular Positive Points
            </h2>

            {insights?.popular_positive_points?.length ? (
              <ul style={{ paddingLeft: "20px", color: "#475569" }}>
                {insights.popular_positive_points.map((item, index) => (
                  <li key={index} style={{ marginTop: "12px" }}>
                    {item.point} ({item.count})
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#94a3b8", marginTop: "18px" }}>
                {loading ? "Loading..." : "No positive points available."}
              </p>
            )}
          </div>
        </div>

        <div style={{ ...cardStyle, marginTop: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <h2 style={{ fontSize: "19px", color: "#1e293b" }}>
              Recent Reviews
            </h2>
            <Link
              to="/analyze"
              style={{ color: "#6d28d9", textDecoration: "none" }}
            >
              Analyze New Review →
            </Link>
          </div>

          {reviews?.reviews?.length ? (
            reviews.reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid #e5e7eb",
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
                  <strong>{review.business_name || "Unknown Business"}</strong>
                  <span
                    style={{
                      color:
                        review.sentiment === "Positive"
                          ? "#15803d"
                          : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {review.sentiment}
                  </span>
                </div>
                <p style={{ color: "#64748b", marginTop: "8px" }}>
                  {review.review}
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: "#94a3b8", marginTop: "18px" }}>
              {loading ? "Loading reviews..." : "No reviews available yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
