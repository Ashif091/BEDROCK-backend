import mongoose, {Schema} from "mongoose"

const WorkspaceSchema = new Schema(
  {
    title: {type: String, required: true},
    workspaceOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {type: String},
    collaborators: [{type: Schema.Types.ObjectId, ref: "User"}],
    documents:[{type: Schema.Types.ObjectId, ref: "Document"}],
  },
  {timestamps: true}
)

export const Workspace = mongoose.model("Workspace", WorkspaceSchema)
