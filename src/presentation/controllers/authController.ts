import {NextFunction, Request, Response} from "express"
import {IUserAuth} from "../../interfaces/IUserAuth"
import {User} from "../../entities/User"

export class authController {
  private authService: IUserAuth
  constructor(authService: IUserAuth) {
    this.authService = authService
  }
  async onRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body: User = req.body
      const existingUser = await this.authService.findUserByEmail(body.email)

      if (existingUser) {
        if (!existingUser.verified) {
          return res.status(409).json({error: "Verification Link Already Send"})
        }
        return res
          .status(409)
          .json({error: "User Already exits with given email "})
      }
      const data = await this.authService.registerUser(body)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
  async authCallbackController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("call back fun in controller with user data : ",req.user)
      const user = req.user as any

      if (!user) {
        return res.status(401).json({message: "Authentication failed"})
      }
      const {accessToken, refreshToken} = this.authService.generateToken(
        user._id
      )
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge:15 * 60 * 1000,
      })
     return  res.redirect(process.env.CLIENT_URL as string)
    } catch (error) {
      next(error)
    }
  }
  async onUserFind(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId as string;
      const user = await this.authService.findUserById(userId);

      let data = {
        id: user?._id,
        fullname: user?.fullname,
        email: user?.email,
        verified: user?.verified,
        profile: user?.profile,
      };
      return res.json(data);
    } catch (error) {
      console.log(error);
    }
  }


  async onVerifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string
      const email = req.query.email as string
      let result
      if (token && email) {
        result = await this.authService.verifyUser(email, token)
        console.log("user verfied", result)
      }
      if (result) {
        console.log(
          "redirected to ",
          `${process.env.CLIENT_URL}/verify-email?token=${token}`
        )

        res.redirect(`${process.env.CLIENT_URL}/verify-email?token=${token}`)
      } else {
        const error = "Invalid token"
        res.redirect(`${process.env.CLIENT_URL}/verify-email?error=${error}`)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, password} = req.body

      const user = await this.authService.loginUser(email, password)

      if (user?._id) {
        const {accessToken, refreshToken} = this.authService.generateToken(
          user._id
        )
        if (accessToken && refreshToken) {
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
          })
          const userInfo = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profile: user.profile,
          }
          return res
            .status(200)
            .json({message: "Sign-in successful", accessToken, userInfo})
        } else {
          return res.status(401).json({error: "Invalid credentials"})
        }
      } else {
        return res.status(401).json({error: "Invalid credentials"})
      }
    } catch (error) {
      console.log(error)
    }
  }
  async onUserLogout(req: Request, res: Response, next: NextFunction) {
    try {
      res.cookie("refreshToken", "", {
        httpOnly: true,
        sameSite: "none",
        expires: new Date(0),
      })
      res.cookie("accessToken", "", {
        httpOnly: true,
        sameSite: "none",
        expires: new Date(0),
      })
      return res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
      next(error)
    }
  }
  async onPartialUpdateUser(req: Request, res: Response, next: NextFunction) {
    console.log("req, got ")
    try {
      const userId = req.userId
      console.log("req, got user id: ", userId)
      if (!userId) {
        return res.status(400).json({error: "User ID is required"})
      }
      const updateData: Partial<User> = req.body

      const updatedUser = await this.authService.partialUpdateUser(
        userId,
        updateData
      )

      if (updatedUser) {
        return res.status(200).json(updatedUser)
      } else {
        return res.status(404).json({error: "User not found"})
      }
    } catch (error) {
      next(error)
    }
  }
}
