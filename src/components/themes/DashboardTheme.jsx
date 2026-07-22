"use client";

import { motion } from "framer-motion";

export default function DashboardTheme({ user, projects }) {
  const githubRepoCount = user.githubRepos?.length || 0;
  const leetcodeSolved = user.leetcodeStats?.totalSolved || 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">{user.name}</h1>
          <p className="text-slate-400 mt-1">{user.bio || "No bio added yet."}</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Projects", value: projects.length },
            { label: "GitHub Repos", value: githubRepoCount },
            { label: "LeetCode Solved", value: leetcodeSolved },
            { label: "GitHub", value: user.githubUsername || "—" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <p className="text-slate-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1 truncate">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Projects Table-style list */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl font-semibold text-white mb-4"
        >
          Projects
        </motion.h2>

        {projects.length === 0 ? (
          <p className="text-slate-500">No projects available yet.</p>
        ) : (
          <div className="space-y-3">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ borderColor: "#10b981" }}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      className="text-sm text-slate-300 border border-slate-700 px-3 py-1.5 rounded hover:bg-slate-800 transition"
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveDemoLink && (
                    <a
                      href={project.liveDemoLink}
                      target="_blank"
                      className="text-sm bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-500 transition"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}