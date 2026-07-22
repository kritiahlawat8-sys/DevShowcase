import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import Project from "@/lib/models/project";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { tenant } = await params;

    const user = await User.findOne({ tenantID: tenant }).select(
      "name bio githubUsername tenantID theme"
    );

    if (!user) {
      return Response.json(
        { message: "Portfolio not found" },
        { status: 404 }
      );
    }

    const projects = await Project.find({
      tenantID: tenant,
    }).sort({ createdAt: -1 });

    return Response.json(
      {
        user,
        projects,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Something went wrong",
        error: error.message,
      },
      { status: 500 }
    );
  }
}