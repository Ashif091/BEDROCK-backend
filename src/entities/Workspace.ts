export interface Workspace {
  _id?: string
  title: string
  workspaceOwner: string 
  collaborators?: string[] 
  documents?: string[] 
  createdAt?: Date
  updatedAt?: Date
}
