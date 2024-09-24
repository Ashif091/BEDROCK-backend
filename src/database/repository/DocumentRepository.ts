import { IDocumentRepository } from "../../interfaces/IDocumentRepository";
import { Document } from "../../entities/Document";
import { Document as DocumentModel } from "../models/Documents";

export class DocumentRepository implements IDocumentRepository {
  async addDocument(data: Partial<Document>): Promise<Document> {
    const document = await DocumentModel.create(data);
    return {
      _id: document._id.toString(),
      workspaceId: document.workspaceId.toString(),
      title: document.title,
      content: document.content || undefined,
      edges: document.edges?.map(edge => edge.toString()) || [],
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  async updateDocument(id: string, data: Partial<Document>): Promise<Document | null> {
    const updatedDocument = await DocumentModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (updatedDocument) {
      return {
        _id: updatedDocument._id.toString(),
        workspaceId: updatedDocument.workspaceId.toString(),
        title: updatedDocument.title,
        content: updatedDocument.content ||undefined,
        edges: updatedDocument.edges?.map(edge => edge.toString()) || [],
        createdAt: updatedDocument.createdAt,
        updatedAt: updatedDocument.updatedAt,
      };
    }
    return null;
  }

  async removeDocument(id: string): Promise<boolean> {
    const result = await DocumentModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async findDocumentById(id: string): Promise<Document | null> {
    const document = await DocumentModel.findById(id);
    if (document) {
      return {
        _id: document._id.toString(),
        workspaceId: document.workspaceId.toString(),
        title: document.title,
        content: document.content || undefined,
        edges: document.edges?.map(edge => edge.toString()) || [],
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      };
    }
    return null;
  }

  async findDocumentsByWorkspaceId(workspaceId: string): Promise<Document[]> {
    const documents = await DocumentModel.find({ workspaceId });
    return documents.map(document => ({
      _id: document._id.toString(),
      workspaceId: document.workspaceId.toString(),
      title: document.title,
      content: document.content || undefined,
      edges: document.edges?.map(edge => edge.toString()) || [],
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    }));
  }
}
