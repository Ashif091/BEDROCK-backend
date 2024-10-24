// services/WorkspaceService.ts
import {Workspace} from "../entities/Workspace"
import {User} from "../entities/User"
import {IWorkspaceRepository} from "../interfaces/IWorkspaceRepository"
import {IWorkspaceService} from "../interfaces/IWorkspaceService"
import {Liveblocks} from "@liveblocks/node"
import dotenv from "dotenv"
import {UserAttachment} from "../entities/UserAttachment"
dotenv.config()
interface createData {
  title: string
  workspaceOwner: string
}
interface liveblocks_user {
  _id: string | undefined
  name: string | undefined
  email: string | undefined
  avatar: string | undefined
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
    room: string,
    workspaceId: string
  ): Promise<any | null> {
    if (!process.env.LIVEBLOCKS_SECRET_KEY) {
      throw new Error(`key file not found`)
    }
    const liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    })
    const session = liveblocks.prepareSession(user._id as string, {
      userInfo: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    })
    const workspace = await this.findWorkspaceById(workspaceId)
    const ownerInfo = await this.userInfo(workspace?.workspaceOwner as string)
    if (!workspace) {
      throw new Error(`Workspace not found`)
    }
    const collaboratorInfo = workspace.collaborators?.find(
      (collaborator) => collaborator.email === user.email
    )

    if (
      collaboratorInfo?.role === "editor" ||
      ownerInfo?.email === user.email
    ) {
      console.log("Granting FULL_ACCESS to editor:", user.email)
      session.allow(room, session.FULL_ACCESS)
    } else {
      console.log(
        "No matching role found. Defaulting to READ_ACCESS for:",
        user.email
      )
      session.allow(room, session.READ_ACCESS)
    }
    const {body} = await session.authorize()
    return body
  }
  async addCollaboratorToWorkspace(
    workspaceId: string,
    email: string,
    role: string
  ): Promise<Workspace | null> {
    return this.workspaceRepository.updateCollaboratorById(
      workspaceId,
      email,
      role
    )
  }

  async onRemoveMember(
    workspaceId: string,
    collaboratorEmail: string
  ): Promise<Workspace | null> {
    const updatedWorkspace =
      await this.workspaceRepository.removeCollaboratorById(
        workspaceId,
        collaboratorEmail
      )

    if (!updatedWorkspace) {
      return null
    }

    return updatedWorkspace
  }
  async getUserAttachmentByEmail(
    userEmail: string
  ): Promise<UserAttachment | null> {
    const userAttachment =
      await this.workspaceRepository.findUserAttachmentByEmail(userEmail)
    return userAttachment
  }
  async findOwnerById(ownerId: string): Promise<any | null> {
    return await this.workspaceRepository.findOwnerById(ownerId)
  }
  async searchRoleByEmail(
    workspaceId: string,
    email: string
  ): Promise<string | null> {
    const workspace: Workspace | null = await this.findWorkspaceById(
      workspaceId
    )

    if (!workspace || !workspace.collaborators) {
      return null
    }

    const collaborator = workspace.collaborators.find(
      (collaborator) => collaborator.email === email
    )

    return collaborator?.role || null
  }
}
