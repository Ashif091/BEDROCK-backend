import { Document } from "../entities/Document";

export interface IDocumentRepository {
    addDocument(data: Partial<Document>): Promise<Document>;
    updateDocument(id: string, data: Partial<Document>): Promise<Document | null>;
    removeDocument(id: string): Promise<boolean>;
    findDocumentById(id: string): Promise<Document | null>;
    findDocumentsByWorkspaceId(workspaceId: string): Promise<Document[]>;
    moveDocumentToTrash(documentId: string): Promise<any | null>
    restoreDocumentFromTrash(documentId: string): Promise<any | null>
    findTrashedDocumentsByWorkspaceId(workspaceId: string): Promise<any[]>
    deleteTrashDocById(documentId: string): Promise<any | null>
    searchTrashedDocumentsByWorkspaceId(workspaceId: string, searchQuery: string): Promise<any[]>
  }
  