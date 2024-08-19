import mongoose, {Schema} from "mongoose"

const DocumentSchema = new Schema(
  { WorkspaceId:{
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
    title: {type: String, required: true},
    content: { type: String },
  },
  {timestamps: true}
)

export const Document = mongoose.model("Document", DocumentSchema)