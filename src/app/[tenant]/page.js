import MinimalistTheme from "@/components/themes/MinimalistTheme";
import DashboardTheme from "@/components/themes/DashboardTheme";
import CyberpunkTheme from "@/components/themes/CyberpunkTheme";
import ThreeDTheme from "@/components/themes/ThreeDTheme";

async function getPortfolio(tenant) {
  const res = await fetch(
    `http://localhost:3000/api/portfolio/${tenant}`,
    { cache: "no-store" }
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

  // theme ke basis pe decide karega ki konsa component render krna h
  switch (user.theme) {
    case "minimalist":
      return <MinimalistTheme user={user} projects={projects} />;
    case "dashboard":
    return <DashboardTheme user={user} projects={projects} />;
     case "cyberpunk":
    return <CyberpunkTheme user={user} projects={projects} />;
    case "3d":
  return <ThreeDTheme user={user} projects={projects} />;
    default:
      return <MinimalistTheme user={user} projects={projects} />;
  }
}