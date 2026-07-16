import connectDB from "@/lib/db";
export async function GET(){
    try{
        await connectDB();
        return Response.json({message: "MONGODB onnected succesfully!"});
    } catch (error) {
        return Response.json({ message: "connection failed", error: error.message}, { status:500});
    }
}