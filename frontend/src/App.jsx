import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.PROD
  ? "https://jetbrains-29aw.onrender.com"
  : "/api";

function formatValue(value) {
  if (value === null) {
    return "null";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function FeedbackCard({ item }) {
  const fields = Object.entries(item);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        {fields.map(([key, value]) => (
          <div
            className="grid gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 sm:grid-cols-[140px_1fr] sm:gap-4"
            key={key}
          >
            <dt className="text-sm font-semibold text-slate-500">{key}</dt>
            <dd className="min-w-0 whitespace-pre-wrap break-words text-sm text-slate-900">
              {formatValue(value)}
            </dd>
          </div>
        ))}
      </div>
    </article>
  );
}

function App() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeedback() {
      try {
        const response = await fetch(`${apiBaseUrl}/feedback`);

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = await response.json();
        setFeedback(data.feedback || []);
      } catch (requestError) {
        setError("Could not load feedback");
      } finally {
        setIsLoading(false);
      }
    }

    loadFeedback();
  }, []);

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
              JetBrains
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Feedback</h1>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold text-white">
            {feedback.length}
          </span>
        </header>

        {isLoading && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            Loading feedback...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {!isLoading && !error && feedback.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
            No feedback yet
          </div>
        )}

        {!isLoading && !error && feedback.length > 0 && (
          <div className="space-y-4">
            {feedback.map((item) => (
              <FeedbackCard item={item} key={item._id || JSON.stringify(item)} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
