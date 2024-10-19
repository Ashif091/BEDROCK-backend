import {User} from "../entities/User"
import { UserAttachment } from "../entities/UserAttachment"
import {Workspace} from "../entities/Workspace"

export interface IWorkspaceRepository {
  findById(id: string): Promise<Workspace | null>
  create(data: Workspace): Promise<Workspace>
  update(id: string, data: Partial<Workspace>): Promise<Workspace | null>
  findByNameAndOwner(data: Workspace): Promise<Workspace | null>
  findAllByOwnerId(ownerId: string): Promise<Workspace[]>
  findUserById(id: string): Promise<User | null>
  updateCollaboratorById(
    workspaceId: string,
    collaboratorEmail: string,
    role: string
  ): Promise<Workspace | null>
  removeCollaboratorById(
    workspaceId: string,
    collaboratorEmail: string
  ): Promise<Workspace | null>
  findUserAttachmentByEmail(userEmail: string): Promise<UserAttachment | null>
}
