import {IDocumentRepository} from "../interfaces/IDocumentRepository"
import {IDocumentService} from "../interfaces/IDocumentService"
import {Document} from "../entities/Document"

export class DocumentService implements IDocumentService {
  private documentRepository: IDocumentRepository

  constructor(documentRepository: IDocumentRepository) {
    this.documentRepository = documentRepository
  }

  async addDocument(data: Partial<Document>): Promise<Document> {
    return this.documentRepository.addDocument(data)
  }

  async updateDocument(
    id: string,
    data: Partial<Document>
  ): Promise<Document | null> {
    return this.documentRepository.updateDocument(id, data)
  }

  async removeDocument(id: string): Promise<boolean> {
    return this.documentRepository.removeDocument(id)
  }

  async findDocumentById(id: string): Promise<Document | null> {
    return this.documentRepository.findDocumentById(id)
  }

  async findDocumentsByWorkspaceId(workspaceId: string): Promise<Document[]> {
    return this.documentRepository.findDocumentsByWorkspaceId(workspaceId)
  }
  async moveDocumentToTrash(documentId: string): Promise<any | null> {
    return this.documentRepository.moveDocumentToTrash(documentId)
  }
  async restoreDocumentFromTrash(documentId: string): Promise<any | null> {
    return this.documentRepository.restoreDocumentFromTrash(documentId)
  }
  async getTrashedDocumentsByWorkspaceId(workspaceId: string): Promise<any[]> {
    return this.documentRepository.findTrashedDocumentsByWorkspaceId(
      workspaceId
    )
  }
  async deleteTrashedDocumentById(documentId: string): Promise<any | null> {
    const res = await this.documentRepository.deleteTrashDocById(documentId)
    return res
  }
  async searchTrashedDocuments(workspaceId: string, searchQuery: string): Promise<any[]> {
    return this.documentRepository.searchTrashedDocumentsByWorkspaceId(workspaceId, searchQuery);
  }
}
