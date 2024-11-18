import { Document } from "../entities/Document";

export interface IDocumentService {
  addDocument(data: Partial<Document>): Promise<Document>;
  updateDocument(id: string, data: Partial<Document>): Promise<Document | null>;
  removeDocument(id: string): Promise<boolean>;
  findDocumentById(id: string): Promise<Document | null>;
  findDocumentsByWorkspaceId(workspaceId: string): Promise<Document[]>;
  moveDocumentToTrash(documentId: string): Promise<any | null>
  restoreDocumentFromTrash(documentId: string): Promise<any | null>
  getTrashedDocumentsByWorkspaceId(workspaceId: string): Promise<any[]>;
  deleteTrashedDocumentById(documentId: string): Promise<any | null>
  searchTrashedDocuments(workspaceId: string, searchQuery: string): Promise<any[]>
  searchDocWithTitle(
    workspaceId: string,
    title: string
  ): Promise<Document | null>
  addEdge(
    workspaceId: string,
    documentId: string,
    edge: string
  ): Promise<Document | null>
  removeEdge(
    workspaceId: string,
    documentId: string
  ): Promise<void>
}
