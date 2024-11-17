import {Request, Response, NextFunction} from "express"
import { IAdminService } from "../../interfaces/IAdminService";

export class AdminController {
  private adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this.adminService = adminService;
  }

  async onAdminLogin(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { adminId, adminKey } = req.body;

      if (!adminId || !adminKey) {
        return res.status(400).json({ message: "adminId and adminKey are required" });
      }

      const isAuthenticated = await this.adminService.authenticateAdmin(adminId, adminKey);

      if (!isAuthenticated) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const {adminAccessToken} = this.adminService.generateToken(adminId)
      if(adminAccessToken){
        res.cookie("adminAccessToken", adminAccessToken, {
            httpOnly: false,
            secure: true,
            maxAge:15 * 60 * 1000,
          })
      }

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      next(error);
    }
  }
  async onAdminVerify(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      return res.status(200).json({ verified: true, message: "Admin is verified." });
    } catch (error) {
      next(error);
    }
  }
  async onGetAllSubscriptions(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const subscriptions = await this.adminService.getAllSubscriptions();
      return res.status(200).json(subscriptions);
    } catch (error) {
      next(error);
    }
  }
  async updateSubscriptionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedSubscription = await this.adminService.updateSubscriptionById(id, updateData);

      if (!updatedSubscription) {
        res.status(404).json({ message: "Subscription not found" });
        return;
      }

      res.status(200).json({ message: "Subscription updated successfully", updatedSubscription });
    } catch (error) {
      next(error);
    }
  }
}
