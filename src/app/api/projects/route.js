import connectDB from "@/lib/db";
import Project from "@/lib/models/project";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

// naya project banane ke liye
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { title, description, techStack, githubLink, liveDemoLink } = body;

    if (!title) {
      return Response.json({ message: "Title is required" }, { status: 400 });
    }

    // admin apni marzi se kisi ke liye bhi bana sakta h, candidate sirf apne liye
    const tenantID =
      session.user.role === "admin" && body.tenantID
        ? body.tenantID
        : session.user.tenantID;

        console.log("SESSION:", session.user);
console.log("BODY:", body);
console.log("TENANT ID:", tenantID);


    const newProject = await Project.create({
      title,
      description,
      techStack,
      githubLink,
      liveDemoLink,
      tenantID,
    });

    return Response.json({ project: newProject }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

// logged in user ke projects list karne ke liye
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // admin sabke projects dekh sakta h, candidate sirf apne
    const query =
      session.user.role === "admin" ? {} : { tenantID: session.user.tenantID };

    const projects = await Project.find(query).sort({ createdAt: -1 });

    return Response.json({ projects }, { status: 200 });
  } catch (error) {
  console.error("========== PROJECT CREATE ERROR ==========");
  console.error(error);
  console.error("=========================================");

  return Response.json(
    {
      message: "Something went wrong",
      error: error.message,
    },
    { status: 500 }
  );
}
}