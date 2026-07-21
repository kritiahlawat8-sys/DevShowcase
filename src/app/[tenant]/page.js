import PortfolioHeader from "@/components/portfolioHeader";
import ProjectCard from "@/components/projectCard";

async function getPortfolio(tenant) {
  const res = await fetch(
    `http://localhost:3000/api/portfolio/${tenant}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function PortfolioPage({ params }) {
  const { tenant } = await params;

  const data = await getPortfolio(tenant);

  if (!data) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Portfolio not found</h1>
      </div>
    );
  }

  const { user, projects } = data;

  return (
  <main className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-5xl mx-auto px-6">

      <PortfolioHeader user={user} />

      <section className="mt-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          My Projects
        </h2>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              No projects available yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  </main>
);
}