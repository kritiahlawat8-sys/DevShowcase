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
    if (!user || !user.githubUsername) {
      return Response.json(
        { message: "GitHub username set nahi hai profile me" },
        { status: 400 }
      );
    }

    const githubRes = await fetch(
      `https://api.github.com/users/${user.githubUsername}/repos?sort=updated&per_page=10`
    );

    if (!githubRes.ok) {
      return Response.json(
        { message: "GitHub username galat hai ya nahi mila" },
        { status: 404 }
      );
    }

    const repos = await githubRes.json();

    const formattedRepos = repos.map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      language: repo.language || "",
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at,
    }));

    user.githubRepos = formattedRepos;
    await user.save();

    return Response.json({ repos: formattedRepos }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}