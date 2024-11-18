import {IDocumentRepository} from "../../interfaces/IDocumentRepository"
import {Document} from "../../entities/Document"
import {Document as DocumentModel} from "../models/Documents"
import {Trash} from "../models/DocumentTrash"

export class DocumentRepository implements IDocumentRepository {
  async addDocument(data: Partial<Document>): Promise<Document> {
    const document = await DocumentModel.create(data)
    return {
      _id: document._id.toString(),
      workspaceId: document.workspaceId.toString(),
      title: document.title,
      content: document.content || undefined,
      edges: document.edges?.map((edge) => edge.toString()) || [],
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    }
  }

  async updateDocument(
    id: string,
    data: Partial<Document>
  ): Promise<Document | null> {
    const updatedDocument = await DocumentModel.findByIdAndUpdate(
      id,
      {$set: data},
      {new: true}
    )
    if (updatedDocument) {
      return {
        _id: updatedDocument._id.toString(),
        workspaceId: updatedDocument.workspaceId.toString(),
        title: updatedDocument.title,
        content: updatedDocument.content || undefined,
        edges: updatedDocument.edges?.map((edge) => edge.toString()) || [],
        createdAt: updatedDocument.createdAt,
        updatedAt: updatedDocument.updatedAt,
      }
    }
    return null
  }

  async removeDocument(id: string): Promise<boolean> {
    const result = await DocumentModel.deleteOne({_id: id})
    return result.deletedCount === 1
  }

  async findDocumentById(id: string): Promise<Document | null> {
    const document = await DocumentModel.findById(id)
    if (document) {
      return {
        _id: document._id.toString(),
        workspaceId: document.workspaceId.toString(),
        title: document.title,
        content: document.content || undefined,
        edges: document.edges?.map((edge) => edge.toString()) || [],
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      }
    }
    return null
  }

  async findDocumentsByWorkspaceId(workspaceId: string): Promise<Document[]> {
    const documents = await DocumentModel.find({workspaceId})
    return documents.map((document) => ({
      _id: document._id.toString(),
      workspaceId: document.workspaceId.toString(),
      title: document.title,
      content: document.content || undefined,
      edges: document.edges?.map((edge) => edge.toString()) || [],
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    }))
  }
  async moveDocumentToTrash(documentId: string): Promise<any | null> {
    const document = await DocumentModel.findById(documentId)
    if (!document) {
      return null
    }

    await Trash.create({
      _id: document._id,
      workspaceId: document.workspaceId,
      title: document.title,
      content: document.content,
      edges: document.edges,
      deletedAt: new Date(),
    })

    const res = await DocumentModel.findByIdAndDelete(documentId)
    return res
  }
  async restoreDocumentFromTrash(documentId: string): Promise<any | null> {
    const trashedDocument = await Trash.findById(documentId)
    if (!trashedDocument) return null

    await DocumentModel.create({
      _id: trashedDocument._id,
      workspaceId: trashedDocument.workspaceId,
      title: trashedDocument.title,
      content: trashedDocument.content,
      edges: trashedDocument.edges,
      deletedAt: new Date(),
    })

    const res = await Trash.findByIdAndDelete(documentId)
    return res
  }
  async findTrashedDocumentsByWorkspaceId(workspaceId: string): Promise<any[]> {
    const trashedDocuments = await Trash.find({ workspaceId }).sort({
      deletedAt: -1,
    });
    return trashedDocuments
  }
  async deleteTrashDocById(documentId: string): Promise<any | null> {
    const trashedDocument = await Trash.deleteOne({ _id: documentId })
    return trashedDocument
  }
  async searchTrashedDocumentsByWorkspaceId(workspaceId: string, searchQuery: string): Promise<any[]> {
    const regex = new RegExp(searchQuery, 'i');

    return Trash.find({
      workspaceId: workspaceId,
      $or: [
        { title: { $regex: regex } },
        { content: { $regex: regex } },
      ],
    }).exec();
  }
  async findDocumentByWorkspaceIdAndTitle(
    workspaceId: string,
    title: string
  ): Promise<Document | null> {
    const document = await DocumentModel.findOne({ workspaceId, title })

    if (document) {
      return {
        _id: document._id.toString(),
        workspaceId: document.workspaceId.toString(),
        title: document.title,
        content: document.content || undefined,
        edges: document.edges?.map((edge) => edge.toString()) || [],
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      }
    }

    return null
  }
}
