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
    },
    // createdAT aur UpdatedAT fields automanicly add krta h
    { timestamps: true}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;