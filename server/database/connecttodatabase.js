import mongoose from "mongoose";

export const connecttodatabase =async ()=>{

try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`mongobd connected: ${connection.connection.host}`)
} catch (error) {
    console.log("error connecting mongodb: ",error.message);
}

};