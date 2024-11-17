import { Subscription } from "../entities/Subscription"
import {IAdToken} from "../interfaces/IAdToken"
import {IAdminRepository} from "../interfaces/IAdminRepository"
import {IAdminService} from "../interfaces/IAdminService"

export class AdminService implements IAdminService {
  private adminRepository: IAdminRepository
  private token: IAdToken
  constructor(adminRepository: IAdminRepository, token: IAdToken) {
    this.adminRepository = adminRepository
    this.token = token
  }

  async authenticateAdmin(adminId: string, adminKey: string): Promise<boolean> {
    const admin = await this.adminRepository.findByAdminId(adminId)
    if (!admin) {
      return false
    }
    return admin.adminKey === adminKey
  }
  generateToken(adminId: string): {
    adminAccessToken: string
  } {
    return this.token.generateAdminTokens(adminId)
  }
  async getAllSubscriptions() {
    return await this.adminRepository.findAllSubscriptions();
  }
  async updateSubscriptionById(id: string, updateData: Partial<Subscription>) {
    return await this.adminRepository.updateSubscriptionById(id, updateData);
  }
}
