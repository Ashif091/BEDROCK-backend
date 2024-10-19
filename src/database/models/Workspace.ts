import mongoose, {Schema} from "mongoose"
const CollaboratorSchema = new Schema(
  {
    email: { type: String, required: false },
    role: { type: String, required: false }, 
  },
  { _id: false } 
);

const WorkspaceSchema = new Schema(
  {
    title: {type: String, required: true},
    workspaceOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: {type: String},
    collaborators: [CollaboratorSchema],
    documents:[{type: Schema.Types.ObjectId, ref: "Document"}],
  },
  {timestamps: true}
)

export const Workspace = mongoose.model("Workspace", WorkspaceSchema)
