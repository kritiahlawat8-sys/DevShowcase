import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type : String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "please enter a valid email"], //format validation
        },
        password :{
            type: String,
            required: true,
        },
        // user admin h ya candidate
        role : {
            type: String,
            enum: ["admin", "candidate"],
            default: "candidate",
        },
        // har candidate ke data ko alag rakhe le liye unique ID- multi-tenancy identify krne ke liye
        tenantID:{
            type:String,
            unique: true,
            sparse: true, 
            // agar tenantID na di jaye (for admin), toh unique rule sirf un docuemnt me apply hoga jinme ye field exist krti h

        },
        bio: {
            type: String,
            default: " ",
        },
        githubUsername:{
            type: String,
            default: "",
        },

        githubRepos: {
  type: [
    {
      name: String,
      description: String,
      url: String,
      language: String,
      stars: Number,
      updatedAt: Date,
    },
  ],
  default: [],
},
leetcodeUsername: {
  type: String,
  default: "",
},
leetcodeStats: {
  type: {
    totalSolved: Number,
    easySolved: Number,
    mediumSolved: Number,
    hardSolved: Number,
    ranking: Number,
  },
  default: {},
},
        // if user haven't configured custom domain
        subdomain: {
            type: String,
            unique: true,
            sparse: true,
        },
        customDomain: {
            type: String,
            default: "",
        },
        theme: {
  type: String,
  enum: ["minimalist", "dashboard", "cyberpunk", "3d"],
  default: "minimalist",
        },
    },
    // createdAT aur UpdatedAT fields automanicly add krta h
    { timestamps: true}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;