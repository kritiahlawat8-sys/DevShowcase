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
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>{user.name}</h1>

      <p>{user.bio}</p>

      <p>
        <strong>GitHub:</strong>{" "}
        {user.githubUsername || "Not provided"}
      </p>

      <hr />

      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "20px",
            }}
          >
            <h3>{project.title}</h3>

            <p>{project.description}</p>

            <p>
              <strong>Tech Stack:</strong>{" "}
              {project.techStack.join(", ")}
            </p>

            {project.githubLink && (
              <p>
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
              </p>
            )}

            {project.liveDemoLink && (
              <p>
                <a
                  href={project.liveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Demo
                </a>
              </p>
            )}
          </div>
        ))
      )}
    </main>
  );
}