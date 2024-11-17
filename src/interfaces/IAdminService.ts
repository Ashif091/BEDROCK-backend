import { Subscription } from "../entities/Subscription";

export interface IAdminService {
  generateToken(adminId: string): {
    adminAccessToken: string
  }
  authenticateAdmin(adminId: string, adminKey: string): Promise<boolean>
  getAllSubscriptions(): Promise<any[]>;
  updateSubscriptionById(id: string, updateData: Partial<Subscription>):Promise<any>;
}
