import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  adminKey: { type: String, required: true },
}); 

export const Admin = mongoose.model("Admin", AdminSchema);
