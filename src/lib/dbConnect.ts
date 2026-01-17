import mongoose, { connections } from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnect():Promise<void>{
    if (connection.isConnected){
        console.log("Already connected to databasse")
        return
    }
    try {
        const db=await mongoose.connect(process.env.MONGO_URI || "")
        console.log(db)
        console.log(connections)
        connection.isConnected=db.connections[0].readyState
        console.log("DB connected successfully.")
    } catch (error) {
        console.log("database connection failed")
        process.exit(1)
    }
}
dbConnect()
export default dbConnect