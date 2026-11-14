
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-800">
        ReviewRadar AI Dashboard
      </h1>

      <p className="mt-3 text-slate-600">
        Welcome to your review analytics dashboard.
      </p>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">
          Review History
        </h2>
        <p className="mt-2 text-slate-500">
          Your analyzed reviews will appear here.
        </p>
      </div>
    </div>
  );
}
