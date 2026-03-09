import mongoose from "mongoose"
import { environment } from "./constants.js";

export const dbConnect = async ()  => {
  try {
    
    const uri: string = environment.dbURI!;
    
    await mongoose.connect(uri)
    console.log("Connected to database successfully!");
  } catch (error) {
    console.error(error);
  }
}