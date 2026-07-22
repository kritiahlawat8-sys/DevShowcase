"use client";

import { motion } from "framer-motion";

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition"
    >
      <h2 className="text-2xl font-semibold text-gray-900">{project.title}</h2>

      <p className="text-gray-600 mt-3">{project.description}</p>

      <div className="flex flex-wrap gap-2 mt-5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            {tech}
          </span>
        ))}
      </div>

     <div className="flex gap-4 mt-6">
  {project.githubLink && (
    <a
      href={project.githubLink}
      target="_blank"
      className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition"
    >
      GitHub
    </a>
  )}

  {project.liveDemoLink && (
    <a
      href={project.liveDemoLink}
      target="_blank"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Live Demo
    </a>
  )}
</div>
 </motion.div>
  );
}