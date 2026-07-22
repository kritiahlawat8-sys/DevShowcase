"use client";

import { motion } from "framer-motion";

export default function CyberpunkTheme({ user, projects }) {
  return (
    <main
      className="min-h-screen bg-zinc-950 text-zinc-100 font-mono py-16 px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-cyan-400/60 text-xs tracking-[0.3em] uppercase mb-2">
            Profile
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-cyan-300"
            style={{ textShadow: "0 0 20px rgba(34,211,238,0.35)" }}
          >
            {user.name}
          </h1>
          <p className="mt-4 text-zinc-400 max-w-2xl leading-relaxed">
            {user.bio || "No bio added yet."}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
        >
          {[
            { label: "Projects", value: projects.length },
            { label: "Repos", value: user.githubRepos?.length || 0 },
            { label: "LeetCode Solved", value: user.leetcodeStats?.totalSolved || 0 },
            { label: "GitHub", value: user.githubUsername || "—" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-cyan-500/20 rounded-lg p-4 bg-zinc-900/50"
            >
              <p className="text-zinc-500 text-xs uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-cyan-300 mt-1 truncate">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Projects */}
        <p className="text-cyan-400/60 text-xs tracking-[0.3em] uppercase mt-14 mb-5">
          Projects
        </p>

        {projects.length === 0 ? (
          <p className="text-zinc-500">No projects available yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ borderColor: "rgba(34,211,238,0.5)" }}
                className="border border-cyan-500/15 rounded-lg p-6 bg-zinc-900/30 transition-colors"
              >
                <h3 className="text-lg font-semibold text-cyan-300">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  {project.description}
                </p>

                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs text-cyan-300/80 border border-cyan-500/20 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-5 mt-5 text-sm">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      className="text-cyan-400 hover:text-cyan-300 transition"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.liveDemoLink && (
                    <a
                      href={project.liveDemoLink}
                      target="_blank"
                      className="text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Live Demo →
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