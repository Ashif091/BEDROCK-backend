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
import passport from "passport"


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
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  controller.authCallbackController.bind(controller)
);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false }),
  controller.authCallbackController.bind(controller) 
);
router.get("/verify-email", controller.onVerifyUser.bind(controller))
router.post("/login", controller.onLoginUser.bind(controller))
router.get("/logout", controller.onUserLogout.bind(controller))
router.patch(
  "/user",
  validateToken,
  controller.onPartialUpdateUser.bind(controller)
)
router.post("/confirm-subscription",validateToken, controller.onConfirmSubscription.bind(controller))
router.get("/users/me", validateToken, controller.onUserFind.bind(controller));
router.get("/user/email/:email", controller.onUserFindByEmail.bind(controller));
router.get("/user/limit", validateToken, controller.onCheckWorkspaceLimit.bind(controller));


export default router
