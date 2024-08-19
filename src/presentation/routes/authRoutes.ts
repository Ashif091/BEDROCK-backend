import express from "express"
import {validateRequest} from "../middleware/validateRequest"
import {userSchema} from "../validators/userValidator"
import {authController} from "../controllers/authController"
import {UserRepository} from "../../database/repository/UserRepository"
import {authService} from "../../services/userService"
import {Mailer} from "../../external-libraries/mailer"
import {Bcrypt} from "../../external-libraries/bcrypt"
import {Token} from "../../external-libraries/Token"
import {validateToken} from "../middleware/validateToken"

const repository = new UserRepository()
const mailer = new Mailer()
const bcrypt = new Bcrypt()
const token = new Token()
const auth = new authService(repository, mailer, bcrypt, token)
const controller = new authController(auth)
const router = express.Router()

router.post(
  "/signup",
  validateRequest(userSchema),
  controller.onRegisterUser.bind(controller)
)
router.get("/verify-email", controller.onVerifyUser.bind(controller))
router.post("/login", controller.onLoginUser.bind(controller));
router.get("/token-check",validateToken)


export default router
