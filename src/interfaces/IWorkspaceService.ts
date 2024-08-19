import { Workspace } from "../entities/Workspace";

export interface IWorkspaceService {
  createWorkspace(input: Workspace): Promise<Workspace>;
  findWorkspaceById(id: string): Promise<Workspace | null>;
  updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace | null>;
  isWorkspaceNameAvailable(data:Workspace): Promise<boolean>;
  getAllWorkspacesByOwner(ownerId: string): Promise<Workspace[]>;
}
