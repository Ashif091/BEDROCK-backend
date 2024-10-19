import {Schema, model} from "mongoose"


const UserAttachmentSchema = new Schema({
  userId: {type: String, required: true},
  sharedWorkspaces: [{type: Schema.Types.ObjectId, ref: "Workspace"}],
})

export const UserAttachmentModel = model("UserAttachment", UserAttachmentSchema)
