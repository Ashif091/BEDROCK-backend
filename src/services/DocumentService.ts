import { IDocumentRepository } from "../interfaces/IDocumentRepository"; 
import { IDocumentService } from "../interfaces/IDocumentService";
import { Document } from "../entities/Document";

export class DocumentService implements IDocumentService {
  private documentRepository: IDocumentRepository;

  constructor(documentRepository: IDocumentRepository) {
    this.documentRepository = documentRepository;
  }

  async addDocument(data: Partial<Document>): Promise<Document> {
    return this.documentRepository.addDocument(data);
  }

  async updateDocument(id: string, data: Partial<Document>): Promise<Document | null> {
    return this.documentRepository.updateDocument(id, data);
  }

  async removeDocument(id: string): Promise<boolean> {
    return this.documentRepository.removeDocument(id);
  }

  async findDocumentById(id: string): Promise<Document | null> {
    return this.documentRepository.findDocumentById(id);
  }

  async findDocumentsByWorkspaceId(workspaceId: string): Promise<Document[]> {
    return this.documentRepository.findDocumentsByWorkspaceId(workspaceId);
  }
}
