export interface Workspace {
  _id?: string
  title: string
  workspaceOwner: string 
  collaborators?: string[] 
  icon?: string
  documents?: string[] 
  createdAt?: Date
  updatedAt?: Date
}
