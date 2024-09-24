import { Request, Response, NextFunction } from "express";
import { IDocumentService } from "../../interfaces/IDocumentService";
import { Document } from "../../entities/Document";

export class DocumentController {
  private documentService: IDocumentService;

  constructor(documentService: IDocumentService) {
    this.documentService = documentService;
  }

  async addDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentData: Partial<Document> = req.body;
      const newDocument = await this.documentService.addDocument(documentData);
      return res.status(201).json(newDocument);
    } catch (error) {
      next(error);
    }
  }

  async updateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id;
      const documentData: Partial<Document> = req.body;
      const updatedDocument = await this.documentService.updateDocument(documentId, documentData);
      if (updatedDocument) {
        return res.status(200).json(updatedDocument);
      } else {
        return res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async removeDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id;
      const success = await this.documentService.removeDocument(documentId);
      if (success) {
        return res.status(200).json({ message: "Document removed successfully" });
      } else {
        return res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async findDocumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id;
      const document = await this.documentService.findDocumentById(documentId);
      if (document) {
        return res.status(200).json(document);
      } else {
        return res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async findDocumentsByWorkspaceId(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.query.workspaceId;
      const documents = await this.documentService.findDocumentsByWorkspaceId(workspaceId as string);
      return res.status(200).json(documents);
    } catch (error) {
      next(error);
    }
  }
}
