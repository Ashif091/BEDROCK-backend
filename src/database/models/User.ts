import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  githubId: { type: String, required: false },
  profile:{type:String , required:false},
  verify_token:{type:String , required:false},
  verified:{type:Boolean , required:true , default:false}
},{timestamps:true}); 

export const User = mongoose.model("User", UserSchema);
