import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    techStack: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      default: "",
    },
    liveDemoLink: {
      type: String,
      default: "",
    },
    tenantID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;