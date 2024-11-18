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
  async searchTrashedDocuments(
    workspaceId: string,
    searchQuery: string
  ): Promise<any[]> {
    return this.documentRepository.searchTrashedDocumentsByWorkspaceId(
      workspaceId,
      searchQuery
    )
  }
  async searchDocWithTitle(
    workspaceId: string,
    title: string
  ): Promise<Document | null> {
    const document =
      await this.documentRepository.findDocumentByWorkspaceIdAndTitle(
        workspaceId,
        title
      )

    return document
  }
  async addEdge(
    workspaceId: string,
    documentId: string,
    edge: string
  ): Promise<Document | null> {
    const document = await this.documentRepository.findDocumentById(documentId)

    if (!document) {
      throw new Error("Document not found")
    }

    if (document.workspaceId !== workspaceId) {
      throw new Error("Document does not belong to the specified workspace")
    }

    document.edges = document.edges || []

    if (document.edges.includes(edge)) {
      console.log("Edge already exists, skipping addition")
      return document
    }

    document.edges.push(edge)

    const updatedDocument = await this.documentRepository.updateDocument(
      documentId,
      {edges: document.edges}
    )

    return updatedDocument
  }
  async removeEdge(
    workspaceId: string,
    documentId: string
  ): Promise<void> {
    const documents = await this.documentRepository.findDocumentsByWorkspaceId(workspaceId);
  
    if (!documents || documents.length === 0) {
      throw new Error("No documents found for the specified workspace");
    }
  
    for (const document of documents) {
      if (document.edges && document.edges.includes(documentId)) {
        document.edges = document.edges.filter(edge => edge !== documentId);
  
         await this.documentRepository.updateDocument(
          document._id.toString(),
          { edges: document.edges }
        );
  
      }
      
    }
  
  }
  
}
