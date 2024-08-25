import { User } from "../entities/User";

export interface IUserAuth {
  registerUser(data: Partial<User>, type?: string): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(email: string): Promise<User | null>;
  loginUser(email: string, password: string): Promise<User | null>;
  generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  };
  verifyUser(email: string, token: string): Promise<User | null>;
  partialUpdateUser(id: string, data: Partial<User>): Promise<User | null>;
} 