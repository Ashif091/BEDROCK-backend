import { Workspace } from "../../entities/Workspace";
import { IWorkspaceRepository } from "../../interfaces/IWorkspaceRepository";
import { Workspace as WorkspaceModel } from "../models/Workspace";

export class WorkspaceRepository implements IWorkspaceRepository {
  async findById(id: string): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.findOne({ _id: id })
    if (workspace) {
      const workspaceData: Workspace = {
        _id: workspace._id.toString(),
        title: workspace.title,
        workspaceOwner: workspace.workspaceOwner.toString(),
        collaborators: workspace.collaborators?.map((collaborator) => collaborator.toString())||undefined,
        documents: workspace.documents.map((document) => document.toString())||undefined,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      };
      return workspaceData;
    }
    return null;
  }
  async findByNameAndOwner(data:Workspace): Promise<Workspace | null> {
    return WorkspaceModel.findOne({ title: data.title, workspaceOwner: data.workspaceOwner });
  }
  async findAllByOwnerId(ownerId: string): Promise<Workspace[]> {
    const workspaces = await WorkspaceModel.find({ workspaceOwner: ownerId })
  
    const formattedWorkspaces: Workspace[] = workspaces.map((workspace) => ({
      _id: workspace._id.toString(),
      title: workspace.title,
      workspaceOwner: workspace.workspaceOwner.toString(),
      collaborators: workspace.collaborators?.map((collaborator) => collaborator.toString()) || undefined,
      documents: workspace.documents?.map((document) => document.toString()) || undefined,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }));
  
    return formattedWorkspaces;
  }
  

  async create(data: Workspace): Promise<Workspace> {
    const newWorkspaceDocument = await WorkspaceModel.create({
      title: data.title,
      workspaceOwner: data.workspaceOwner,
    });

    const newWorkspace: Workspace = {
      _id: newWorkspaceDocument._id.toString(),
      title: newWorkspaceDocument.title,
      workspaceOwner: newWorkspaceDocument.workspaceOwner.toString(),
      collaborators: newWorkspaceDocument.collaborators?.map((collaborator) => collaborator.toString())||undefined,
      documents: newWorkspaceDocument.documents?.map((document) => document.toString())||undefined,
      createdAt: newWorkspaceDocument.createdAt,
      updatedAt: newWorkspaceDocument.updatedAt,
    };

    return newWorkspace;
  }

  async update(id: string, data: Partial<Workspace>): Promise<Workspace | null> {
    const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (updatedWorkspace) {
      return {
        _id: updatedWorkspace._id.toString(),
        title: updatedWorkspace.title,
        workspaceOwner: updatedWorkspace.workspaceOwner.toString(),
        icon: updatedWorkspace.icon?.toString()||undefined,
        collaborators: updatedWorkspace.collaborators?.map((collaborator) => collaborator.toString())||undefined,
        documents: updatedWorkspace.documents?.map((document) => document.toString())||undefined,
        createdAt: updatedWorkspace.createdAt,
        updatedAt: updatedWorkspace.updatedAt,
      };
    }
    return null;
  }
}
