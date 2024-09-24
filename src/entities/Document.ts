export interface Document {
    _id: string;
    workspaceId: string;
    title: string;
    content?: string;
    edges?: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  