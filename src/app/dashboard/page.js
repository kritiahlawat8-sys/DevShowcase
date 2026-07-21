"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [githubRepos, setGithubRepos] = useState([]);
const [leetcodeStats, setLeetcodeStats] = useState(null);
const [syncMsg, setSyncMsg] = useState("");
const [syncing, setSyncing] = useState(false);

  const [profile, setProfile] = useState({ name: "", bio: "", githubUsername: "", leetcodeUsername: "" });
  const [projects, setProjects] = useState([]);
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
    });
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

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    const data = await res.json();
    setProfileMsg(res.ok ? "Profile updated" : data.message);
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
  setEditProject({
    ...editProject,
    [e.target.name]: e.target.value,
  });
};

const handleUpdateProject = async (e) => {
  e.preventDefault();

  const payload = {
    ...editProject,
    techStack: editProject.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  const res = await fetch(`/api/projects/${editingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
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

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You are not logged in.</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Dashboard</h1>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>

      <p>
        Logged in as <strong>{session.user.email}</strong> ({session.user.role})
      </p>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>Edit Profile</h2>
        <form onSubmit={handleProfileSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={profile.name}
            onChange={handleProfileChange}
          />
          <br />
          <textarea
            name="bio"
            placeholder="Bio"
            value={profile.bio}
            onChange={handleProfileChange}
            rows={3}
          />
          <br />
          <input
            type="text"
            name="githubUsername"
            placeholder="GitHub Username"
            value={profile.githubUsername}
            onChange={handleProfileChange}
          />
          <br />
          <input
  type="text"
  name="leetcodeUsername"
  placeholder="LeetCode Username"
  value={profile.leetcodeUsername}
  onChange={handleProfileChange}
/>
<br />
          <button type="submit">Save Profile</button>
        </form>
        {profileMsg && <p>{profileMsg}</p>}
      </section>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>Add Project</h2>
        <form onSubmit={handleAddProject}>
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={newProject.title}
            onChange={handleNewProjectChange}
            required
          />
          <br />
          <textarea
            name="description"
            placeholder="Description"
            value={newProject.description}
            onChange={handleNewProjectChange}
            rows={2}
          />
          <br />
          <input
            type="text"
            name="techStack"
            placeholder="Tech Stack (comma separated)"
            value={newProject.techStack}
            onChange={handleNewProjectChange}
          />
          <br />
          <input
            type="text"
            name="githubLink"
            placeholder="GitHub Link"
            value={newProject.githubLink}
            onChange={handleNewProjectChange}
          />
          <br />
          <input
            type="text"
            name="liveDemoLink"
            placeholder="Live Demo Link"
            value={newProject.liveDemoLink}
            onChange={handleNewProjectChange}
          />
          <br />
          <button type="submit">Add Project</button>
        </form>
        {projectMsg && <p>{projectMsg}</p>}
      </section>

      <hr style={{ margin: "20px 0" }} />

      <section>
        <h2>My Projects</h2>
        {loadingProjects && <p>Loading projects...</p>}
        {!loadingProjects && projects.length === 0 && <p>No projects yet.</p>}
        {projects.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
    <h3>{p.title}</h3>
    <p>{p.description}</p>
    <p>Tech: {p.techStack?.join(", ")}</p>
    <button onClick={() => handleDeleteProject(p._id)}>Delete</button>
  </div>
        ))}
      </section>
      <hr style={{ margin: "20px 0" }} />

<section>
  <h2>GitHub & LeetCode Sync</h2>
  <button onClick={handleSyncGithub} disabled={syncing}>
    {syncing ? "Syncing..." : "Sync GitHub"}
  </button>{" "}
  <button onClick={handleSyncLeetcode} disabled={syncing}>
    {syncing ? "Syncing..." : "Sync LeetCode"}
  </button>
  {syncMsg && <p>{syncMsg}</p>}

  <h3>GitHub Repos</h3>
  {githubRepos.length === 0 && <p>No repos synced yet.</p>}
  {githubRepos.map((repo, i) => (
    <div key={i} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h4>{repo.name}</h4>
      <p>{repo.description}</p>
      <p>Language: {repo.language} | ⭐ {repo.stars}</p>
      <a href={repo.url} target="_blank" rel="noopener noreferrer">View on GitHub</a>
    </div>
  ))}

  <h3>LeetCode Stats</h3>
  {!leetcodeStats && <p>No stats synced yet.</p>}
  {leetcodeStats && (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <p>Total Solved: {leetcodeStats.totalSolved}</p>
      <p>Easy: {leetcodeStats.easySolved} | Medium: {leetcodeStats.mediumSolved} | Hard: {leetcodeStats.hardSolved}</p>
      <p>Ranking: {leetcodeStats.ranking}</p>
    </div>
  )}
</section>
    </div>
  );
}

