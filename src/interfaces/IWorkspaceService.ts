import { User } from "../entities/User";
import { UserAttachment } from "../entities/UserAttachment";
import { Workspace } from "../entities/Workspace";
interface liveblocks_user {
  _id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  avatar: string | undefined;
}
export interface IWorkspaceService {
  createWorkspace(input: Workspace): Promise<Workspace>;
  findWorkspaceById(id: string): Promise<Workspace | null>;
  updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace | null>;
  isWorkspaceNameAvailable(data:Workspace): Promise<boolean>;
  getAllWorkspacesByOwner(ownerId: string): Promise<Workspace[]>;
  userInfo(id: string): Promise<User | null>;
  authorizeLiveblocksSession(user: liveblocks_user, room: string): Promise<any | null>
  addCollaboratorToWorkspace(workspaceId: string, email: string,role:string): Promise<Workspace | null>;
  onRemoveMember(
    workspaceId: string,
    collaboratorEmail: string
  ): Promise<Workspace | null>
  getUserAttachmentByEmail(userEmail: string): Promise<UserAttachment | null> 
  findOwnerById(ownerId: string): Promise<any | null>
}
