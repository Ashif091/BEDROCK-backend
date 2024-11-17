import {Admin} from "../models/Admin"
import {Subscription} from "../models/Subscription"
import {IAdminRepository} from "../../interfaces/IAdminRepository"
import {Subscription as ISubscription} from "../../entities/Subscription"

export class AdminRepository implements IAdminRepository {
  async findByAdminId(adminId: string) {
    return await Admin.findOne({adminId})
  }
  async findAllSubscriptions() {
    return await Subscription.find()
  }
  async updateSubscriptionById(id: string, updateData: Partial<ISubscription>) {
    return await Subscription.findByIdAndUpdate(id, updateData, {new: true})
  }
}
