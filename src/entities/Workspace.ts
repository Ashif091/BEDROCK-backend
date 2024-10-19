export interface Workspace {
  _id?: string;
  title: string;
  workspaceOwner: string;
  collaborators?: {
    email: string;
    role?: string; 
  }[];
  icon?: string;
  documents?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
