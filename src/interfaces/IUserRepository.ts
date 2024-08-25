import { User } from "../entities/User";

export interface IUserRepository {
  create(data: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(email: string): Promise<User | null>;
  update(id: string, data: any): Promise<User | null>;
}