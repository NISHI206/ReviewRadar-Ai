
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  ChartNoAxesCombined,
  Radar,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  MessageSquareText,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    Icon: BrainCircuit,
    number: "01",
    title: "Sentiment Analysis",
    desc: "Understand whether your customers feel positive, negative, or neutral using machine learning.",
  },
  {
    Icon: Radar,
    number: "02",
    title: "Aspect Analysis",
    desc: "Discover exactly what customers love and what needs improvement in your products.",
  },
  {
    Icon: ChartNoAxesCombined,
    number: "03",
    title: "Business Insights",
    desc: "Turn complex review data into actionable recommendations with Generative AI.",
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link to="/" className="brand">
          <span className="brand-icon"><Radar size={23} /></span>
          <span>Review<span className="brand-accent">Radar</span></span>
        </Link>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <Link to="/login">Login</Link>
        </div>

        <Link to="/signup" className="nav-cta">
        Get Started <ArrowRight size={16} />
      </Link>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={14} />
              AI-POWERED REVIEW INTELLIGENCE
            </div>

            <h1>
              Every Review Has
              <br />
              A Story. <span>Discover It.</span>
            </h1>

            <p className="hero-description">
              Stop guessing what your customers think. Analyze reviews,
              uncover sentiment, identify recurring issues and transform
              feedback into smarter business decisions.
            </p>

            <div className="hero-actions">
            <Link to="/signup" className="primary-cta">
              Analyze Reviews <ArrowRight size={18} />
            </Link>

            <Link to="/login" className="secondary-cta">
              Explore Dashboard <ChevronRight size={17} />
            </Link>
          </div>

            <div className="hero-trust">
              <span><ShieldCheck size={17} /> AI-powered insights</span>
              <span><Zap size={17} /> Fast analysis</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="analytics-window">
              <div className="window-header">
                <div className="window-dots">
                  <i /><i /><i />
                </div>
                <span>ReviewRadar / Analytics</span>
                <Sparkles size={17} />
              </div>

              <div className="analytics-body">
                <div className="analytics-title">
                  <div>
                    <span className="mini-label">OVERVIEW</span>
                    <h3>Review Insights</h3>
                  </div>
                  <span className="live-tag">● Live Preview</span>
                </div>

                <div className="sentiment-summary">
                  <div className="sentiment-main">
                    <span className="mini-label">CUSTOMER SENTIMENT</span>
                    <h2>Positive</h2>
                    <span className="positive-text">
                      <TrendingUp size={15} /> Sentiment overview
                    </span>
                  </div>
                  <div className="sentiment-chart">
                    <div className="chart-circle">
                      <div>
                        <strong>78%</strong>
                        <small>Positive</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="preview-divider" />

                <span className="mini-label">INSIGHT HIGHLIGHTS</span>

                <div className="insight-row">
                  <span className="insight-icon purple"><MessageSquareText size={17} /></span>
                  <div>
                    <strong>Customer Feedback</strong>
                    <small>Identify recurring review themes</small>
                  </div>
                  <ChevronRight size={17} />
                </div>

                <div className="insight-row">
                  <span className="insight-icon blue"><BrainCircuit size={17} /></span>
                  <div>
                    <strong>AI Recommendations</strong>
                    <small>Discover improvement opportunities</small>
                  </div>
                  <ChevronRight size={17} />
                </div>
              </div>
            </div>

            <div className="floating-chip">
              <span className="chip-icon"><Sparkles size={17} /></span>
              <div>
                <strong>Smarter insights</strong>
                <small>Powered by AI</small>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-eyebrow">WHAT WE OFFER</span>
            <h2>Everything you need to understand your customers.</h2>
            <p>From raw feedback to meaningful insights, all in one place.</p>
          </div>

          <div className="feature-grid">
            {features.map(({ Icon, number, title, desc }) => (
              <article className="feature-card" key={title}>
                <div className="feature-top">
                  <div className="feature-icon"><Icon size={25} /></div>
                  <span>{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <Link to="/analyze" className="feature-link">
                  Explore feature <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section" id="how-it-works">
          <div className="workflow-content">
            <span className="section-eyebrow">SIMPLE WORKFLOW</span>
            <h2>From customer reviews to confident decisions.</h2>
            <p>
              Make sense of customer feedback with a simple,
              intelligent review analysis workflow.
            </p>
            <Link to="/analyze" className="primary-cta">
              Start Analyzing <ArrowRight size={18} />
            </Link>
          </div>

          <div className="workflow-steps">
            <div><span>01</span><div><strong>Submit Reviews</strong><small>Enter your product and customer reviews.</small></div></div>
            <div><span>02</span><div><strong>AI Analysis</strong><small>Discover sentiment and important aspects.</small></div></div>
            <div><span>03</span><div><strong>Get Insights</strong><small>Understand results and take action.</small></div></div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <Link to="/" className="brand">
          <span className="brand-icon"><Radar size={20} /></span>
          <span>Review<span className="brand-accent">Radar</span></span>
        </Link>
        <p>Turning customer voices into business intelligence.</p>
        <span>© 2026 ReviewRadar AI</span>
      </footer>
    </div>
  );
}
