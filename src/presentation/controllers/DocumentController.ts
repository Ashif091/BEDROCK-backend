import {Request, Response, NextFunction} from "express"
import {IDocumentService} from "../../interfaces/IDocumentService"
import {Document} from "../../entities/Document"

export class DocumentController {
  private documentService: IDocumentService

  constructor(documentService: IDocumentService) {
    this.documentService = documentService
  }

  async addDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentData: Partial<Document> = req.body
      const newDocument = await this.documentService.addDocument(documentData)
      req.io
        .to(newDocument.workspaceId)
        .emit("create-doc", {newDocument, createdBy: req.userId})
      return res.status(201).json(newDocument)
    } catch (error) {
      next(error)
    }
  }

  async updateDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id
      const documentData: Partial<Document> = req.body
      const updatedDocument = await this.documentService.updateDocument(
        documentId,
        documentData
      )
      if (updatedDocument) {
        return res.status(200).json(updatedDocument)
      } else {
        return res.status(404).json({error: "Document not found"})
      }
    } catch (error) {
      next(error)
    }
  }

  async removeDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id
      const success = await this.documentService.removeDocument(documentId)
      if (success) {
        return res.status(200).json({message: "Document removed successfully"})
      } else {
        return res.status(404).json({error: "Document not found"})
      }
    } catch (error) {
      next(error)
    }
  }

  async findDocumentById(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id
      const document = await this.documentService.findDocumentById(documentId)
      if (document) {
        return res.status(200).json(document)
      } else {
        return res.status(404).json({error: "Document not found"})
      }
    } catch (error) {
      next(error)
    }
  }

  async findDocumentsByWorkspaceId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const workspaceId = req.query.workspaceId
      const documents = await this.documentService.findDocumentsByWorkspaceId(
        workspaceId as string
      )
      return res.status(200).json(documents)
    } catch (error) {
      next(error)
    }
  }
  async moveToTrash(req: Request, res: Response): Promise<void> {
    try {
      const {id} = req.params
      const document = await this.documentService.moveDocumentToTrash(id)
      if (document) {
        res.status(200).json({message: "Document moved to trash", document})
      } else {
        res.status(404).json({message: "Document not found"})
      }
    } catch (error) {
      res.status(500).json({message: "Server error", error})
    }
  }
  async restoreFromTrash(req: Request, res: Response): Promise<void> {
    try {
      const {id} = req.params
      const document = await this.documentService.restoreDocumentFromTrash(id)
      // console.log("🚀 ~ DocumentController ~ restoreFromTrash ~ document:", document)
      // req.io.to(document.workspaceId.toString()).emit("create-doc",{document,createdBy:req.userId})

      if (document) {
        res
          .status(200)
          .json({message: "Document restored from trash", document})
      } else {
        res.status(404).json({message: "Document not found or not in trash"})
      }
    } catch (error) {
      res.status(500).json({message: "Server error", error})
    }
  }
  async getTrashByWorkspaceId(req: Request, res: Response): Promise<void> {
    try {
      const {workspaceId} = req.params
      const trashedDocuments =
        await this.documentService.getTrashedDocumentsByWorkspaceId(workspaceId)

      res.status(200).json({trashedDocuments})
    } catch (error) {
      res.status(500).json({message: "Server error", error})
    }
  }
  async trashDocDeleteById(req: Request, res: Response): Promise<void> {
    try {
      const {id} = req.params

      const deletedDocument =
        await this.documentService.deleteTrashedDocumentById(id)

      if (deletedDocument) {
        res.status(200).json(deletedDocument)
      } else {
        res.status(404).json({message: "Document not found or not trashed"})
      }
    } catch (error) {
      res.status(500).json({message: "Server error", error})
    }
  }
  async searchTrashDoc(req: Request, res: Response): Promise<void> {
    try {
      const {workspaceId, searchQuery} = req.body

      const results = await this.documentService.searchTrashedDocuments(
        workspaceId,
        searchQuery
      )

      res.status(200).json(results)
    } catch (error) {
      res.status(500).json({message: "Server error", error})
    }
  }
  async onGetDocGraphById(req: Request, res: Response): Promise<void> {
    try {
      const {workspaceId} = req.body

      const results = await this.documentService.findDocumentsByWorkspaceId(
        workspaceId
      )

      const graphData = results.map((doc) => ({
        id: doc._id,
        label: doc.title,
        link: doc.edges || [],
      }))

      res.status(200).json(graphData)
    } catch (error) {
      res.status(500).json({message: "Server error", error})
    }
  }
}
