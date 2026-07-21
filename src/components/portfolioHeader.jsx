export default function PortfolioHeader({ user }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-10 text-center">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      <h1 className="text-4xl font-bold text-gray-900">
        {user.name}
      </h1>

      <p className="mt-3 text-gray-600 max-w-xl mx-auto">
        {user.bio || "No bio added yet."}
      </p>

      <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 rounded-full px-5 py-2">
        <span className="font-medium text-gray-700">
          GitHub
        </span>

        <span className="text-blue-600 font-semibold">
          {user.githubUsername || "Not Added"}
        </span>
      </div>
    </section>
  );
}