import jwt from "jsonwebtoken"
import {IAdToken} from "../interfaces/IAdToken"
import dotenv from 'dotenv';
dotenv.config();

export class AdToken implements IAdToken {
  private readonly JWT_Key: string = process.env.JWT_SECRET || " "
  generateAdminTokens(adminId: string): {
    adminAccessToken: string
  } {
    const adminAccessToken = jwt.sign({adminId}, this.JWT_Key, {
      expiresIn: "15m",
    })
    return {adminAccessToken}
  }
  verifyAdminAccessToken(token: string): any {
    return jwt.verify(token, this.JWT_Key)
  }
}
