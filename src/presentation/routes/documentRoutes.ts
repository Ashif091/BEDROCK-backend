import express from "express";
import { DocumentController } from "../controllers/DocumentController";
import { DocumentService } from "../../services/DocumentService";
import { DocumentRepository } from "../../database/repository/DocumentRepository";
import { validateToken } from "../middleware/validateToken";

const router = express.Router();

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

router.post("/",validateToken, documentController.addDocument.bind(documentController));
router.get("/",validateToken, documentController.findDocumentsByWorkspaceId.bind(documentController));
router.put("/:id",validateToken, documentController.updateDocument.bind(documentController));
router.delete("/:id",validateToken, documentController.removeDocument.bind(documentController));
router.get("/:id",validateToken, documentController.findDocumentById.bind(documentController));
router.delete("/trash/:id",validateToken, documentController.moveToTrash.bind(documentController));
router.delete("/trash/delete/:id",validateToken, documentController.trashDocDeleteById.bind(documentController));
router.get("/trash/:id",validateToken, documentController.restoreFromTrash.bind(documentController));
router.get("/:workspaceId/trash",validateToken, documentController.getTrashByWorkspaceId.bind(documentController));
router.post("/trash/search",validateToken, documentController.searchTrashDoc.bind(documentController));
export default router;
