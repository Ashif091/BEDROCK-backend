import { User } from "../../entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { User as UserModel} from "../models/User";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const User = await UserModel.findOne({ _id: id });
    if (User) {
      const userData: User = {
        _id: User._id.toString(),
        fullname: User.fullname,
        email: User.email,
        password: User.password||undefined,
        profile: User.profile || undefined,
        verify_token: User.verify_token||undefined,
        verified: User.verified,
      };
      return userData;
    }
    return null;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const User = await UserModel.findOne({ email: email });
    if (User) {
      const userData: User = {
        _id: User._id.toString(),
        fullname: User.fullname,
        email: User.email,
        password: User.password|| undefined,
        profile: User.profile || undefined,
        verify_token: User.verify_token|| undefined,
        verified: User.verified,
      };
      return userData;
    }
    return null;
  }

  async create(data: User): Promise<User> {
    const newUserDocument = await UserModel.create(data);
    const newUser: User = {
      _id: newUserDocument._id.toString(),
      fullname: newUserDocument.fullname,
      email: newUserDocument.email,
      password: newUserDocument.password || undefined,
      profile: newUserDocument.profile || undefined,
      verify_token: newUserDocument.verify_token || undefined,
      verified: newUserDocument.verified,
    };
    return newUser;
  }
  async update(id: string, data:  Partial<User>): Promise<User | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    if (updatedUser) {
      return {
        _id: updatedUser._id.toString(),
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        profile: updatedUser.profile || undefined,
        verify_token: updatedUser.verify_token|| undefined,
        verified: updatedUser.verified,
      };
    }
    return null;
  }

}