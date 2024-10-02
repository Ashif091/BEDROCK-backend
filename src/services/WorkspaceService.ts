// services/WorkspaceService.ts
import {Workspace} from "../entities/Workspace"
import {User} from "../entities/User"
import {IWorkspaceRepository} from "../interfaces/IWorkspaceRepository"
import {IWorkspaceService} from "../interfaces/IWorkspaceService"
import {Liveblocks} from "@liveblocks/node"
import dotenv from "dotenv"
dotenv.config()
interface createData {
  title: string
  workspaceOwner: string
}
interface liveblocks_user {
  _id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
}
export class WorkspaceService implements IWorkspaceService {
  private workspaceRepository: IWorkspaceRepository
  constructor(workspaceRepository: IWorkspaceRepository) {
    this.workspaceRepository = workspaceRepository
  }

  async createWorkspace(data: createData): Promise<Workspace> {
    const newWorkspace = await this.workspaceRepository.create(data)
    // created info sent to the email ----------------
    // if (this.mailer) {
    //   const owner = await this.userRepository.findById(newWorkspace.workspaceOwner);
    //   if (owner && owner.email) {
    //     const emailContent = `Hello ${owner.fullname}, your workspace "${newWorkspace.title}" has been successfully created.`;
    //     this.mailer.SendEmail(owner.email, emailContent);
    //   }
    // }
    return newWorkspace
  }
  async isWorkspaceNameAvailable(data: Workspace): Promise<boolean> {
    const existingWorkspace = await this.workspaceRepository.findByNameAndOwner(
      data
    )
    console.log(
      "status in service :",
      existingWorkspace !== null ? true : false
    )

    return existingWorkspace !== null ? true : false
  }

  async findWorkspaceById(id: string): Promise<Workspace | null> {
    return this.workspaceRepository.findById(id)
  }
  async getAllWorkspacesByOwner(ownerId: string): Promise<Workspace[]> {
    return this.workspaceRepository.findAllByOwnerId(ownerId)
  }

  async updateWorkspace(
    id: string,
    data: Partial<Workspace>
  ): Promise<Workspace | null> {
    return this.workspaceRepository.update(id, data)
  }

  async userInfo(id: string): Promise<User | null> {
    return this.workspaceRepository.findUserById(id)
  }
  async authorizeLiveblocksSession(
    user: liveblocks_user,
    room: string
  ): Promise<any | null> {
    if(!process.env.LIVEBLOCKS_SECRET_KEY){
      throw new Error(`key file not found`);
    }
    const liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    })
    console.log("🚀 ~ WorkspaceService ~ liveblocks:", liveblocks)
    const session = liveblocks.prepareSession(user._id as string, {
      userInfo: { 
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
    console.log("🚀 ~ WorkspaceService ~ session:", session)
    if (room) {
      console.log("🚀 ~ WorkspaceService ~ room:", room)
      session.allow(room, session.FULL_ACCESS);
    }
    const { body } = await session.authorize();
    console.log("🚀 ~ WorkspaceService ~ body:", body)
    return body;
  }
}
