import mongoose, {Schema} from "mongoose"

const DocumentSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    title: {type: String, required: true},
    content: {type: String},
    edges: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
      },
    ],
  },
  {timestamps: true}
)

export const Document = mongoose.model("Document", DocumentSchema)
