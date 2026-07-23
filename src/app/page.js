import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          DevShowcase
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          A multi-tenant portfolio CMS — build your profile, sync your GitHub
          &amp; LeetCode stats, and get a live animated portfolio in seconds.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}