import { Document } from "../entities/Document";

export interface IDocumentService {
  addDocument(data: Partial<Document>): Promise<Document>;
  updateDocument(id: string, data: Partial<Document>): Promise<Document | null>;
  removeDocument(id: string): Promise<boolean>;
  findDocumentById(id: string): Promise<Document | null>;
  findDocumentsByWorkspaceId(workspaceId: string): Promise<Document[]>;
}
