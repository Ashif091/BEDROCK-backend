import mongoose, { Schema } from "mongoose";

const TrashSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String },
    edges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    deletedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

export const Trash = mongoose.model("Trash", TrashSchema);
