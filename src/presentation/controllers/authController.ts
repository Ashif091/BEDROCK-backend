import { NextFunction, Request, Response } from "express";
import { IUserAuth } from "../../interfaces/IUserAuth";
import { User } from "../../entities/User";



export class authController {
  private authService: IUserAuth;
  constructor(authService: IUserAuth) {
    this.authService = authService;
  }
  async onRegisterUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body:User = req.body;
      const existingUser = await this.authService.findUserByEmail(body.email);

      if (existingUser) {
        if (!existingUser.verified) {
          return res
            .status(409)
            .json({ error: "Verification Link Already Send" });
        }
        return res
          .status(409)
          .json({ error: "User Already exits with given email " });
      }
      const data = await this.authService.registerUser(body);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
  async onVerifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      const email = req.query.email as string;
      let result 
      if(token&&email){
        result = await this.authService.verifyUser(email, token);
        console.log("user verfied",result);
        
      }
        if (result) {
          console.log("redirected to ",`${ process.env.CLIENT_URL}/verify-email?token=${token}`);
          
          res.redirect(`${ process.env.CLIENT_URL}/verify-email?token=${token}`);
        } else {
          const error = "Invalid token";
          res.redirect(`${ process.env.CLIENT_URL}/verify-email?error=${error}`);
        }
    } catch (error) {
      console.log(error);
      next(error)
    }
  }
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await this.authService.loginUser(email, password);
      
      if (user?._id) {
        const { accessToken,refreshToken} = this.authService.generateToken(
          user._id
        );
        if (accessToken && refreshToken) {
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite:"none",
            maxAge: 24 * 60 * 60 * 1000,
          });
          return res.status(200).json({ message: "Sign-in successful", accessToken});
        } else {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  

}