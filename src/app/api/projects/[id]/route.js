import connectDB from "@/lib/db";
import Project from "@/lib/models/project";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const project = await Project.findById(id);

    if (!project) {
      return Response.json({ message: "Project not found" }, { status: 404 });
    }

    if (session.user.role !== "admin" && project.tenantID !== session.user.tenantID) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, techStack, githubLink, liveDemoLink } = body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (techStack !== undefined) project.techStack = techStack;
    if (githubLink !== undefined) project.githubLink = githubLink;
    if (liveDemoLink !== undefined) project.liveDemoLink = liveDemoLink;

    await project.save();

    return Response.json({ project }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const project = await Project.findById(id);

    if (!project) {
      return Response.json({ message: "Project not found" }, { status: 404 });
    }

    if (session.user.role !== "admin" && project.tenantID !== session.user.tenantID) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }

    await Project.findByIdAndDelete(id);

    return Response.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
