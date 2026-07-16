import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/lib/models/user";
import bcrypt from "bcryptjs";

const handler = NextAuth ({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email:{label: "Email", type:"email"},
                password: { label: "Password", type: "password"},
            },
            async authorize(credentials){
                await connectDB();

                const user = await User.findOne({ email: credentials.email});

                if (!user) {
                    throw new Error(" no user found with this email");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Incorrect password");
                    }

                    return{
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        tenantID: user.tenantID,
                    };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user}) {
            if (user) {
                token.role = user.role;
                token.tenantID = user.tenantID;
            }
            return token;
        },

        async session ({ session, token }) {

            session.user.role = token.role;
            session.user.tenantID;
            return sesssion
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    });
    
    export { handle as GET, handler as POST };