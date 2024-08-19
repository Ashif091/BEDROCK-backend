// services/WorkspaceService.ts
import {Workspace} from "../entities/Workspace"
import {IWorkspaceRepository} from "../interfaces/IWorkspaceRepository"
import {IWorkspaceService} from "../interfaces/IWorkspaceService"
interface createData {
  title:string
  workspaceOwner:string
}
export class WorkspaceService implements IWorkspaceService {
  private workspaceRepository: IWorkspaceRepository
  constructor(workspaceRepository: IWorkspaceRepository) {
    this.workspaceRepository = workspaceRepository
  }

  async createWorkspace(data:createData): Promise<Workspace> {
    
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
  async isWorkspaceNameAvailable(data:Workspace): Promise<boolean> {
    const existingWorkspace = await this.workspaceRepository.findByNameAndOwner(data);
    console.log("status in service :",existingWorkspace!==null?true:false);
    
    return existingWorkspace!==null?true:false;
  }

  async findWorkspaceById(id: string): Promise<Workspace | null> {
    return this.workspaceRepository.findById(id)
  }
  async getAllWorkspacesByOwner(ownerId: string): Promise<Workspace[]> {
    return this.workspaceRepository.findAllByOwnerId(ownerId);
  }

  async updateWorkspace(
    id: string,
    data: Partial<Workspace>
  ): Promise<Workspace | null> {
    return this.workspaceRepository.update(id, data)
  }
}
