import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

export const validateAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const JWT_KEY = process.env.JWT_SECRET as string
    const adminAccessToken = req.cookies.adminAccessToken

    if (!adminAccessToken) {
      return res
        .status(401)
        .json({message: "Admin access token not found. Access denied."})
    }

    jwt.verify(adminAccessToken, JWT_KEY, (err: any, data: any) => {
      if (err) {
        return res
          .status(403)
          .json({message: "Invalid admin access token. Access denied."})
      }
      if (data.adminId) {
        // for duouble securirty use db verify also
        next()
      } else {
        return res
          .status(403)
          .json({message: "Invalid admin access token. Access denied."})
      }
    })
  } catch (error) {
    return res.status(500).json({message: "Internal server error", error})
  }
}
