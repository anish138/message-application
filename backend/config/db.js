import mongoose from "mongoose";

export const connectdb = async()=>{

    try{

        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database is connected")

    }catch(error){

        console.log("Database connection faild",error)
        process.exit(1);
    }
}