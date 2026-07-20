import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";

export async function POST (request) {
    try {
        await connectDB();
        
        const body = await request.json();
        const { name, email, password, role, tenantID, subdomain } = body;

        const finalTenantID =
  tenantID && tenantID.trim() !== ""
    ? tenantID
    : crypto.randomUUID();

        if (!name || !email || !password){
            return Response.json(
                { message: "Nmae, email, and password are required"},
                { status: 400}
            );
        }
const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email : normalizedEmail});
        if (existingUser) {
            return Response.json(
                { message: "user with this email already exists"},
                { status: 409}
            );
        }

        const hashedPassword = await bcrypt.hash(password,10);
    
    const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role || "candidate",
        tenantID: finalTenantID,
        subdomain,
    });

    return Response.json(
        {
            message: "user created succesfully",
            user :{ 
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        },
        { status: 201}
    );
} 
catch (error) {
    console.error("Signup Error:", error);

    return Response.json(
        {
            message: "something went wrong",
            error: error.message,
        },
        { status: 500 }
    );
}
    }
