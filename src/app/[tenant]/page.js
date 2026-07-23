import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import Project from "@/lib/models/project";

import MinimalistTheme from "@/components/themes/MinimalistTheme";
import DashboardTheme from "@/components/themes/DashboardTheme";
import CyberpunkTheme from "@/components/themes/CyberpunkTheme";
import ThreeDTheme from "@/components/themes/ThreeDTheme";

export default async function PortfolioPage({ params }) {
  const { tenant } = await params;

  await connectDB();

  const user = await User.findOne({ tenantID: tenant }).lean();
  const projects = await Project.find({ tenantID: tenant }).lean();

  if (!user) {
    return (
      <div className="p-10">
        <h1>Portfolio not found</h1>
      </div>
    );
  }

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