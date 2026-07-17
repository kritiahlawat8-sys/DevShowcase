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
    const { name, bio, githubUsername } = body;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(githubUsername !== undefined && { githubUsername }),
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
