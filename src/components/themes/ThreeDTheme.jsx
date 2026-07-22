"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";

function TiltCard({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [12, -12]);
  const rotateY = useTransform(x, [-100, 100], [-12, 12]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="bg-gradient-to-br from-indigo-950 to-zinc-900 border border-indigo-500/20 rounded-2xl p-6"
    >
      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </motion.div>
  );
}

export default function ThreeDTheme({ user, projects }) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white py-16 px-6" style={{ perspective: 1500 }}>
      <div className="max-w-5xl mx-auto">

        {/* Profile */}
        <TiltCard>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            {user.name}
          </h1>
          <p className="mt-3 text-zinc-400 max-w-xl">
            {user.bio || "No bio added yet."}
          </p>
          <div className="flex gap-6 mt-6 text-sm text-zinc-400">
            <span>Projects: <span className="text-indigo-300 font-semibold">{projects.length}</span></span>
            <span>Repos: <span className="text-indigo-300 font-semibold">{user.githubRepos?.length || 0}</span></span>
            <span>LeetCode: <span className="text-indigo-300 font-semibold">{user.leetcodeStats?.totalSolved || 0}</span></span>
          </div>
        </TiltCard>

        {/* Projects */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-indigo-200 mt-14 mb-6"
        >
          Projects
        </motion.h2>

        {projects.length === 0 ? (
          <p className="text-zinc-500">No projects available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TiltCard>
                  <h3 className="text-xl font-semibold text-indigo-200">
                    {project.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-2">
                    {project.description}
                  </p>

                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs text-indigo-200 bg-indigo-500/10 px-2 py-1 rounded"
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
                        className="text-indigo-300 hover:text-indigo-200 transition"
                      >
                        GitHub →
                      </a>
                    )}
                    {project.liveDemoLink && (
                      <a
                        href={project.liveDemoLink}
                        target="_blank"
                        className="text-indigo-300 hover:text-indigo-200 transition"
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}