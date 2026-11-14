




import { useState, useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  analyzeReview,
  analyzeCsv,
  type ReviewAnalysis,
} from "../services/api";

export default function Analyze() {
  const [businessName, setBusinessName] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState("");
  const [csvResults, setCsvResults] = useState<ReviewAnalysis[]>([]);
  const [totalProcessed, setTotalProcessed] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    setCsvError("");
    setCsvResults([]);
    setTotalProcessed(null);

    if (!file) {
      setCsvFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setCsvFile(null);
      setCsvError("Please select a valid CSV file.");
      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setCsvFile(null);
      setCsvError("The selected file is empty.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setCsvFile(null);
      setCsvError("File size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    setCsvFile(file);
  }

  function handleRemoveFile() {
    setCsvFile(null);
    setCsvError("");
    setCsvResults([]);
    setTotalProcessed(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleCsvAnalyze() {
    if (!csvFile) {
      setCsvError("Please select a CSV file first.");
      return;
    }

    try {
      setCsvLoading(true);
      setCsvError("");
      setCsvResults([]);
      setTotalProcessed(null);

      const result = await analyzeCsv(csvFile);

      setCsvResults(result.results || []);
      setTotalProcessed(result.total_processed);
    } catch (err) {
      setCsvError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the CSV file. Please try again."
      );
    } finally {
      setCsvLoading(false);
    }
  }

  function formatFileSize(size: number) {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <main className="analyze-page">
      <div className="analyze-container">
        <div className="analyze-heading">
          <span className="analyze-tag">
            AI-POWERED REVIEW INTELLIGENCE
          </span>

          <h1>Analyze Customer Reviews</h1>

          <p>
            Understand customer sentiment and discover meaningful insights
            from your reviews.
          </p>
        </div>

        {/* Single Review Analysis */}
        <section className="analyze-card">
          <h2>Analyze a Single Review</h2>

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

        {/* CSV Bulk Analysis */}
        <section
          className="analyze-card"
          style={{ marginTop: "28px" }}
        >
          <h2>Bulk Review Analysis</h2>

          <p style={{ color: "#64748b", marginBottom: "20px" }}>
            Upload a CSV file containing multiple customer reviews
            to analyze them together.
          </p>

          <div className="form-group">
            <label htmlFor="csvFile">Upload CSV File</label>

            <input
              ref={fileInputRef}
              id="csvFile"
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              disabled={csvLoading}
            />

            <span className="character-count">
              CSV files only · Maximum file size: 10 MB
            </span>
          </div>

          {csvFile && (
            <div
              style={{
                marginTop: "16px",
                padding: "14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
            >
              <p style={{ color: "#334155", fontWeight: 600 }}>
                Selected file
              </p>

              <p
                style={{
                  color: "#475569",
                  marginTop: "8px",
                  overflowWrap: "anywhere",
                }}
              >
                {csvFile.name}
              </p>

              <p style={{ color: "#64748b", marginTop: "5px" }}>
                File size: {formatFileSize(csvFile.size)}
              </p>

              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={csvLoading}
                style={{
                  marginTop: "12px",
                  padding: "8px 14px",
                  border: "1px solid #dc2626",
                  borderRadius: "7px",
                  background: "white",
                  color: "#dc2626",
                  cursor: "pointer",
                }}
              >
                Remove file
              </button>
            </div>
          )}

          {csvError && (
            <p className="analyze-error" style={{ marginTop: "14px" }}>
              {csvError}
            </p>
          )}

          <button
            className="analyze-button"
            onClick={handleCsvAnalyze}
            disabled={csvLoading || !csvFile}
            style={{ marginTop: "18px" }}
          >
            {csvLoading ? "Analyzing CSV..." : "Analyze CSV →"}
          </button>

          {totalProcessed !== null && (
            <div style={{ marginTop: "24px" }}>
              <h3>CSV Analysis Completed</h3>

              <p style={{ color: "#475569", marginTop: "10px" }}>
                Total reviews processed: <strong>{totalProcessed}</strong>
              </p>

              {csvResults.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <h3>Analysis Results</h3>

                  {csvResults.map((item, index) => (
                    <div
                      key={item.id || index}
                      style={{
                        background: "#f8fafc",
                        padding: "16px",
                        borderRadius: "10px",
                        marginTop: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>
                          {item.business_name || `Review ${index + 1}`}
                        </strong>

                        <strong
                          style={{
                            color:
                              item.sentiment === "Positive"
                                ? "#15803d"
                                : item.sentiment === "Negative"
                                  ? "#dc2626"
                                  : "#64748b",
                          }}
                        >
                          {item.sentiment}
                        </strong>
                      </div>

                      <p style={{ color: "#475569", marginTop: "10px" }}>
                        {item.review}
                      </p>

                      <p style={{ color: "#64748b", marginTop: "8px" }}>
                        Confidence: {Math.round(item.confidence * 100)}%
                      </p>

                      <p style={{ color: "#475569", marginTop: "8px" }}>
                        {item.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
