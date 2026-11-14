
import { Link } from "react-router-dom";
import { BrainCircuit, ChartNoAxesCombined, Radar, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex items-center justify-between px-8 py-5">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Radar className="text-blue-600" />
          ReviewRadar
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link
            to="/analyze"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-8 py-24">
        <div className="max-w-3xl">
          <p className="mb-4 font-semibold text-blue-600">
            AI-POWERED REVIEW INTELLIGENCE
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Turn Customer Feedback Into Smarter Decisions.
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Analyze reviews, discover customer sentiment,
            identify recurring issues and generate actionable
            business insights.
          </p>

          <Link
            to="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Analyze Reviews <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Sentiment Analysis",
              desc: "Classify customer reviews using Machine Learning.",
              Icon: BrainCircuit,
            },
            {
              title: "Aspect Analysis",
              desc: "Identify what customers like and dislike.",
              Icon: Radar,
            },
            {
              title: "Business Insights",
              desc: "Generate actionable recommendations with GenAI.",
              Icon: ChartNoAxesCombined,
            },
          ].map(({ title, desc, Icon }) => (
            <div key={title} className="rounded-xl border bg-white p-6 shadow-sm">
              <Icon className="mb-4 text-blue-600" size={30} />
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
