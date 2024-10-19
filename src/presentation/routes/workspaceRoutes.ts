// routes/workspaceRoutes.ts
import express from "express"
import {WorkspaceController} from "../controllers/WorkspaceController"
import {WorkspaceRepository} from "../../database/repository/WorkspaceRepository"
import {WorkspaceService} from "../../services/WorkspaceService"
import {validateToken} from "../middleware/validateToken"

const repository = new WorkspaceRepository()
const service = new WorkspaceService(repository)
const controller = new WorkspaceController(service)
const router = express.Router()

router.get(
  "/",
  validateToken,
  controller.getAllWorkspacesByOwner.bind(controller)
);
router.post(
  "/create",
  validateToken,
  controller.onCreateWorkspace.bind(controller)
)

router.get(
  "/:id",
  validateToken,
  controller.onGetWorkspaceById.bind(controller)
)
 
router.patch(
  "/update/:id",
  validateToken, 
  controller.onUpdateWorkspace.bind(controller)
)

router.post(
  "/check-name",
  validateToken,
  controller.checkWorkspaceNameAvailability.bind(controller)
); 

router.post(
  "/liveblocks-auth",
  validateToken,
  controller.liveblocksAuth.bind(controller)
); 
router.post(
  "/update-member",
  validateToken,
  controller.onUpdateMember.bind(controller)
); 
router.delete("/remove-member",validateToken, controller.onRemoveMember.bind(controller))

export default router
 