import {User} from "../entities/User"
import {IUserRepository} from "../interfaces/IUserRepository"
import {IUserAuth} from "../interfaces/IUserAuth"
import {IBcrypt} from "../interfaces/IBcrypt"
import { IMailer } from "../interfaces/IMailer";
import {IToken} from "../interfaces/IToken"
import {v4 as uuidv4} from "uuid"
import emailTemplate from "../presentation/utils/emailTemplate";

export class authService implements IUserAuth {
  private repository: IUserRepository
  private mailer: IMailer;
  private bcrypt: IBcrypt
  private token: IToken
  constructor(
    repository: IUserRepository,
    mailer: IMailer,
    bcrypt: IBcrypt,
    token: IToken
  ) {
    this.repository = repository
    this.mailer = mailer;
    this.bcrypt = bcrypt
    this.token = token
  }
  generateToken(userId: string): {
    accessToken: string
    refreshToken: string
  } {
    return this.token.generateTokens(userId)
  }

  findUserByEmail(email: string): Promise<User | null> {
    const user = this.repository.findByEmail(email)
    return user
  }
  findUserById(id: string): Promise<User | null> {
    const user = this.repository.findById(id)
    return user
  }

  async registerUser(input: User, type?: string) {
    if (input.password) {
      const hashedPassword = await this.bcrypt.Encrypt(input.password)
      input.password = hashedPassword
    }
    const token = uuidv4()
    input.verify_token = token
    const data = await this.repository.create(input)
    console.log("data of register :" , input,"\n res :",data);
    if (type) {
      return data
    } else {
      const email = data.email
      const html = emailTemplate(data.fullname, email, token);
      this.mailer.SendEmail(email, html);
      return data
    }
  }
  async verifyUser(email: string, token: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (user) {
      if (user.verify_token === token) {
        const data = {
          verified: true,
        };
        const update = await this.repository.update(user._id, data);
        if (update) {
          return update;
        }
      }
    }
    return null;
  }
  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    
    if (user.password &&user.verified) {
      const isPasswordCorrect = await this.bcrypt.compare(
        password,
        user.password
      );
      
      if (isPasswordCorrect && user._id !== undefined) {
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  
  async partialUpdateUser(id: string, data: Partial<User>): Promise<User | null> {
    return await this.repository.update(id, data);
  }
}
