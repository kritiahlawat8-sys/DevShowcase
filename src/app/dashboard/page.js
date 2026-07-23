"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    githubUsername: "",
    leetcodeUsername: "",
    theme: "minimalist",
  });
  const [projects, setProjects] = useState([]);
  const [tenantID, setTenantID] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveDemoLink: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editProject, setEditProject] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveDemoLink: "",
  });

  const [githubRepos, setGithubRepos] = useState([]);
  const [leetcodeStats, setLeetcodeStats] = useState(null);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncing, setSyncing] = useState(false);

  const [profileMsg, setProfileMsg] = useState("");
  const [projectMsg, setProjectMsg] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (session) {
      fetchProfile();
      fetchProjects();
    }
  }, [session]);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    const data = await res.json();
    if (res.ok) {
      setProfile({
        name: data.user.name || "",
        bio: data.user.bio || "",
        githubUsername: data.user.githubUsername || "",
        leetcodeUsername: data.user.leetcodeUsername || "",
        theme: data.user.theme || "minimalist",
      });
      setTenantID(data.user.tenantID || "");
      setGithubRepos(data.user.githubRepos || []);
      setLeetcodeStats(data.user.leetcodeStats || null);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (res.ok) {
      setProjects(data.projects);
    }
    setLoadingProjects(false);
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    setProfileMsg(res.ok ? "Profile updated!" : data.message);
  };

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    setProfile({ ...profile, theme: newTheme });

    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, theme: newTheme }),
    });
  };

  const handleNewProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setProjectMsg("");

    const payload = {
      ...newProject,
      techStack: newProject.techStack.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setNewProject({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveDemoLink: "",
      });
      fetchProjects();
    } else {
      setProjectMsg(data.message);
    }
  };

  const handleDeleteProject = async (id) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProjects();
    }
  };

  const startEditing = (project) => {
    setEditingId(project._id);
    setEditProject({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      githubLink: project.githubLink,
      liveDemoLink: project.liveDemoLink,
    });
  };

  const handleEditChange = (e) => {
    setEditProject({ ...editProject, [e.target.name]: e.target.value });
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    const payload = {
      ...editProject,
      techStack: editProject.techStack.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const res = await fetch(`/api/projects/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditingId(null);
      setEditProject({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveDemoLink: "",
      });
      fetchProjects();
    }
  };

  const handleSyncGithub = async () => {
    setSyncing(true);
    setSyncMsg("");
    const res = await fetch("/api/sync/github", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setGithubRepos(data.repos);
      setSyncMsg("GitHub repos synced!");
    } else {
      setSyncMsg(data.message);
    }
    setSyncing(false);
  };

  const handleSyncLeetcode = async () => {
    setSyncing(true);
    setSyncMsg("");
    const res = await fetch("/api/sync/leetcode", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setLeetcodeStats(data.stats);
      setSyncMsg("LeetCode stats synced!");
    } else {
      setSyncMsg(data.message);
    }
    setSyncing(false);
  };

  if (status === "loading")
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!session)
    return <div className="min-h-screen flex items-center justify-center text-gray-500">You are not logged in.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as <span className="font-medium text-gray-700">{session.user.email}</span>{" "}
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded ml-1">{session.user.role}</span>
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
          >
            Sign Out
          </button>
        </div>

        {/* Theme Selector + Live Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Theme</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <select
              value={profile.theme}
              onChange={handleThemeChange}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="minimalist">Minimalist ATS / Corporate</option>
              <option value="dashboard">Data / Metrics Dashboard</option>
              <option value="cyberpunk">Cyberpunk / Terminal</option>
              <option value="3d">Interactive 3D</option>
            </select>

            {tenantID && (
              <a
                href={`/portfolio/${tenantID}`}
                target="_blank"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
              >
                Preview Live Portfolio →
              </a>
            )}
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={profile.bio}
              onChange={handleProfileChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="githubUsername"
              placeholder="GitHub Username"
              value={profile.githubUsername}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="leetcodeUsername"
              placeholder="LeetCode Username"
              value={profile.leetcodeUsername}
              onChange={handleProfileChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Save Profile
            </button>
          </form>
          {profileMsg && <p className="text-sm text-green-600 mt-2">{profileMsg}</p>}
        </div>

        {/* GitHub & LeetCode Sync */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">GitHub & LeetCode Sync</h2>
          <div className="flex gap-3">
            <button
              onClick={handleSyncGithub}
              disabled={syncing}
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "Sync GitHub"}
            </button>
            <button
              onClick={handleSyncLeetcode}
              disabled={syncing}
              className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {syncing ? "Syncing..." : "Sync LeetCode"}
            </button>
          </div>
          {syncMsg && <p className="text-sm text-gray-600 mt-2">{syncMsg}</p>}

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">GitHub Repos ({githubRepos.length})</h3>
            {githubRepos.length === 0 ? (
              <p className="text-sm text-gray-400">No repos synced yet.</p>
            ) : (
              <div className="space-y-2">
                {githubRepos.map((repo, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-900">{repo.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{repo.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{repo.language} · ⭐ {repo.stars}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {leetcodeStats && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">LeetCode Stats</h3>
              <div className="border border-gray-200 rounded-lg p-3 text-sm flex gap-4 flex-wrap">
                <span>Total: <b>{leetcodeStats.totalSolved}</b></span>
                <span>Easy: <b>{leetcodeStats.easySolved}</b></span>
                <span>Medium: <b>{leetcodeStats.mediumSolved}</b></span>
                <span>Hard: <b>{leetcodeStats.hardSolved}</b></span>
                <span>Rank: <b>{leetcodeStats.ranking}</b></span>
              </div>
            </div>
          )}
        </div>

        {/* Add Project */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Project</h2>
          <form onSubmit={handleAddProject} className="space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
              value={newProject.title}
              onChange={handleNewProjectChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newProject.description}
              onChange={handleNewProjectChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="techStack"
              placeholder="Tech Stack (comma separated)"
              value={newProject.techStack}
              onChange={handleNewProjectChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="githubLink"
              placeholder="GitHub Link"
              value={newProject.githubLink}
              onChange={handleNewProjectChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="liveDemoLink"
              placeholder="Live Demo Link"
              value={newProject.liveDemoLink}
              onChange={handleNewProjectChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              Add Project
            </button>
          </form>
          {projectMsg && <p className="text-sm text-red-600 mt-2">{projectMsg}</p>}
        </div>

        {/* My Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Projects</h2>
          {loadingProjects && <p className="text-sm text-gray-400">Loading projects...</p>}
          {!loadingProjects && projects.length === 0 && (
            <p className="text-sm text-gray-400">No projects yet.</p>
          )}
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p._id} className="border border-gray-200 rounded-lg p-4">
                {editingId === p._id ? (
                  <form onSubmit={handleUpdateProject} className="space-y-2">
                    <input
                      type="text"
                      name="title"
                      value={editProject.title}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <textarea
                      name="description"
                      value={editProject.description}
                      onChange={handleEditChange}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <input
                      type="text"
                      name="techStack"
                      value={editProject.techStack}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <input
                      type="text"
                      name="githubLink"
                      value={editProject.githubLink}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <input
                      type="text"
                      name="liveDemoLink"
                      value={editProject.liveDemoLink}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-lg hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="font-semibold text-gray-900">{p.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Tech: {p.techStack?.join(", ")}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => startEditing(p)}
                        className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p._id)}
                        className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
} 