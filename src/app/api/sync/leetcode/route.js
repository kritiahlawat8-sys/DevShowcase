import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user || !user.leetcodeUsername) {
      return Response.json(
        { message: "LeetCode username set nahi hai profile me" },
        { status: 400 }
      );
    }

    const lcRes = await fetch(
      `https://leetcode-stats-api.herokuapp.com/${user.leetcodeUsername}`
    );

    if (!lcRes.ok) {
      return Response.json(
        { message: "LeetCode username galat hai ya API down hai" },
        { status: 404 }
      );
    }

    const data = await lcRes.json();

    if (data.status === "error") {
      return Response.json({ message: "LeetCode user nahi mila" }, { status: 404 });
    }

    user.leetcodeStats = {
      totalSolved: data.totalSolved,
      easySolved: data.easySolved,
      mediumSolved: data.mediumSolved,
      hardSolved: data.hardSolved,
      ranking: data.ranking,
    };
    await user.save();

    return Response.json({ stats: user.leetcodeStats }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}