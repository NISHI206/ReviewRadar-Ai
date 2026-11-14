


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeReview } from "../services/api";

export default function Analyze() {
  const [businessName, setBusinessName] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleAnalyze() {
    if (!review.trim()) {
      setError("Please enter a customer review.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await analyzeReview({
        review,
        business_name: businessName,
      });

      navigate("/results", {
        state: { result },
      });
    } catch {
      setError("Unable to analyze the review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="analyze-page">
      <div className="analyze-container">
        <div className="analyze-heading">
          <span className="analyze-tag">AI-POWERED REVIEW INTELLIGENCE</span>
          <h1>Analyze Customer Reviews</h1>
          <p>
            Understand customer sentiment and discover meaningful insights
            from your reviews.
          </p>
        </div>

        <section className="analyze-card">
          <div className="form-group">
            <label htmlFor="businessName">
              Business / Product Name
              <span> (Optional)</span>
            </label>

            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Amazon, Nike, Starbucks"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerReview">Customer Review</label>

            <textarea
              id="customerReview"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Paste your customer review here..."
              rows={7}
            />
            <span className="character-count">
              {review.length} characters
            </span>
          </div>

          {error && <p className="analyze-error">{error}</p>}

          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Review →"}
          </button>

          <p className="analyze-note">
            Your review will be processed for sentiment and customer insights.
          </p>
        </section>
      </div>
    </main>
  );
}
