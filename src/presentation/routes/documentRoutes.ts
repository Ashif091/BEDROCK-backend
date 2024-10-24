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
router.delete("/trash/:id", documentController.moveToTrash.bind(documentController));
router.delete("/trash/delete/:id", documentController.trashDocDeleteById.bind(documentController));
router.get("/trash/:id", documentController.restoreFromTrash.bind(documentController));
router.get("/:workspaceId/trash", documentController.getTrashByWorkspaceId.bind(documentController));
router.post("/trash/search", documentController.searchTrashDoc.bind(documentController));
export default router;
