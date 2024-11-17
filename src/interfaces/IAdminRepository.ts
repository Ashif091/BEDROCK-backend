import { Subscription } from "../entities/Subscription"

export interface IAdminRepository {
  findByAdminId(adminId: string): Promise<any | null>
  findAllSubscriptions(): Promise<any[]>
  updateSubscriptionById(id: string, updateData: Partial<Subscription>): Promise<any | null>
}
