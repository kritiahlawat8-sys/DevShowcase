import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, bio, githubUsername, leetcodeUsername } = body;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(githubUsername !== undefined && { githubUsername }),
        ...(leetcodeUsername !== undefined && { leetcodeUsername }),
      },
      { new: true }
    ).select("-password");

    return Response.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ user }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  } 
}