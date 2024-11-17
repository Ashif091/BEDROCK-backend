import express from "express"
import {AdminController} from "../controllers/AdminController"
import {AdminService} from "../../services/AdminService"
import {AdminRepository} from "../../database/repository/AdminRepository"
import {AdToken} from "../../external-libraries/AdToken"
import {validateAdminToken} from "../middleware/validateAdminToken"

const repository = new AdminRepository()
const token = new AdToken()
const service = new AdminService(repository, token)
const controller = new AdminController(service)
const router = express.Router()

router.post("/login", controller.onAdminLogin.bind(controller))
router.get(
  "/verify",
  validateAdminToken,
  controller.onAdminVerify.bind(controller)
)
router.get("/subscriptions", controller.onGetAllSubscriptions.bind(controller))
router.patch(
  "/subscription/update/:id",
  validateAdminToken,
  controller.updateSubscriptionById.bind(controller)
)

export default router
