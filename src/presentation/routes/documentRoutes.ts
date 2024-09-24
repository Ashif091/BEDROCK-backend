import express from "express";
import { DocumentController } from "../controllers/DocumentController";
import { DocumentService } from "../../services/DocumentService";
import { DocumentRepository } from "../../database/repository/DocumentRepository";

const router = express.Router();

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

router.post("/", documentController.addDocument.bind(documentController));
router.get("/", documentController.findDocumentsByWorkspaceId.bind(documentController));
router.put("/:id", documentController.updateDocument.bind(documentController));
router.delete("/:id", documentController.removeDocument.bind(documentController));
router.get("/:id", documentController.findDocumentById.bind(documentController));

export default router;
