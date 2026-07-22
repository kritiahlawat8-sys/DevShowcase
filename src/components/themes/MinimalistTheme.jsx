"use client";

import { motion } from "framer-motion";
import PortfolioHeader from "@/components/portfolioHeader";
import ProjectCard from "@/components/projectCard";

export default function MinimalistTheme({ user, projects }) {
  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6">
        <PortfolioHeader user={user} />

        <section className="mt-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-6"
          >
            My Projects
          </motion.h2>

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No projects available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}