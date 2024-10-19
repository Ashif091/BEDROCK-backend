import {User} from "../../entities/User"
import {Workspace} from "../../entities/Workspace"
import {IWorkspaceRepository} from "../../interfaces/IWorkspaceRepository"
import {Workspace as WorkspaceModel} from "../models/Workspace"
import {User as UserModel} from "../models/User"
import {UserAttachment} from "../../entities/UserAttachment"
import {UserAttachmentModel} from "../models/UserAttachment"

export class WorkspaceRepository implements IWorkspaceRepository {
  async findById(id: string): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.findOne({_id: id})
    if (workspace) {
      const workspaceData: Workspace = {
        _id: workspace._id.toString(),
        title: workspace.title,
        icon: workspace.icon?.toString(),
        workspaceOwner: workspace.workspaceOwner.toString(),
        collaborators:
          workspace.collaborators
            ?.filter((collaborator) => collaborator.email) // Ensure email exists
            .map((collaborator) => ({
              email: collaborator.email as string, // Assert email is a string
              role: collaborator.role || undefined, // Set role if exists
            })) || undefined,

        documents:
          workspace.documents.map((document) => document.toString()) ||
          undefined,
        createdAt: workspace.createdAt,
        updatedAt: workspace.updatedAt,
      }
      return workspaceData
    }
    return null
  }
  async findByNameAndOwner(data: Workspace): Promise<Workspace | null> {
    return WorkspaceModel.findOne({
      title: data.title,
      workspaceOwner: data.workspaceOwner,
    })
  }
  async findUserById(id: string): Promise<User | null> {
    const User = await UserModel.findOne({_id: id})
    if (User) {
      const userData: User = {
        _id: User._id.toString(),
        fullname: User.fullname,
        email: User.email,
        password: User.password || undefined,
        profile: User.profile || undefined,
        verify_token: User.verify_token || undefined,
        verified: User.verified,
      }
      return userData
    }
    return null
  }
  async findAllByOwnerId(ownerId: string): Promise<Workspace[]> {
    const workspaces = await WorkspaceModel.find({workspaceOwner: ownerId})

    const formattedWorkspaces: Workspace[] = workspaces.map((workspace) => ({
      _id: workspace._id.toString(),
      title: workspace.title,
      icon: workspace.icon?.toString(),
      workspaceOwner: workspace.workspaceOwner.toString(),
      collaborators:
        workspace.collaborators
          ?.filter((collaborator) => collaborator.email)
          .map((collaborator) => ({
            email: collaborator.email as string,
            role: collaborator.role || undefined,
          })) || undefined,

      documents:
        workspace.documents?.map((document) => document.toString()) ||
        undefined,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }))

    return formattedWorkspaces
  }

  async create(data: Workspace): Promise<Workspace> {
    const newWorkspaceDocument = await WorkspaceModel.create({
      title: data.title,
      workspaceOwner: data.workspaceOwner,
    })

    const newWorkspace: Workspace = {
      _id: newWorkspaceDocument._id.toString(),
      title: newWorkspaceDocument.title,
      workspaceOwner: newWorkspaceDocument.workspaceOwner.toString(),
      collaborators:
        newWorkspaceDocument.collaborators
          ?.filter((collaborator) => collaborator.email)
          .map((collaborator) => ({
            email: collaborator.email as string,
            role: collaborator.role || undefined,
          })) || undefined,
      documents:
        newWorkspaceDocument.documents?.map((document) =>
          document.toString()
        ) || undefined,
      createdAt: newWorkspaceDocument.createdAt,
      updatedAt: newWorkspaceDocument.updatedAt,
    }

    return newWorkspace
  }

  async update(
    id: string,
    data: Partial<Workspace>
  ): Promise<Workspace | null> {
    const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
      {_id: id},
      {$set: data},
      {new: true}
    )

    if (updatedWorkspace) {
      return {
        _id: updatedWorkspace._id.toString(),
        title: updatedWorkspace.title,
        workspaceOwner: updatedWorkspace.workspaceOwner.toString(),
        icon: updatedWorkspace.icon?.toString() || undefined,
        collaborators:
          updatedWorkspace.collaborators
            ?.filter((collaborator) => collaborator.email)
            .map((collaborator) => ({
              email: collaborator.email as string,
              role: collaborator.role || undefined,
            })) || undefined,
        documents:
          updatedWorkspace.documents?.map((document) => document.toString()) ||
          undefined,
        createdAt: updatedWorkspace.createdAt,
        updatedAt: updatedWorkspace.updatedAt,
      }
    }
    return null
  }
  async updateCollaboratorById(
    workspaceId: string,
    collaboratorEmail: string,
    role: string
  ): Promise<Workspace | null> {
    const workspace = await WorkspaceModel.findOne({_id: workspaceId})
    if (!workspace) {
      return null
    }
    const existingCollaborator = workspace.collaborators.find(
      (collaborator) => collaborator.email === collaboratorEmail
    )
    if (existingCollaborator) {
      existingCollaborator.role = role
    } else {
      workspace.collaborators.push({email: collaboratorEmail, role})
      await UserAttachmentModel.updateOne(
        { userId: collaboratorEmail }, 
        { $addToSet: { sharedWorkspaces: workspaceId } },
        { upsert: true } 
      );
    }
    const updatedWorkspace = await workspace.save()
    return {
      _id: updatedWorkspace._id.toString(),
      title: updatedWorkspace.title,
      workspaceOwner: updatedWorkspace.workspaceOwner.toString(),
      icon: updatedWorkspace.icon?.toString() || undefined,
      collaborators:
        updatedWorkspace.collaborators
          ?.filter((collaborator) => collaborator.email)
          .map((collaborator) => ({
            email: collaborator.email as string,
            role: collaborator.role || undefined,
          })) || undefined,
      documents:
        updatedWorkspace.documents?.map((document) => document.toString()) ||
        undefined,
      createdAt: updatedWorkspace.createdAt,
      updatedAt: updatedWorkspace.updatedAt,
    }
  }
  async removeCollaboratorById(
    workspaceId: string,
    collaboratorEmail: string
  ): Promise<Workspace | null> {
    const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
      {_id: workspaceId},
      {$pull: {collaborators: {email: collaboratorEmail}}},
      {new: true}
    )

    if (!updatedWorkspace) {
      return null
    }
    await UserAttachmentModel.updateOne(
      { userId: collaboratorEmail }, 
      { $pull: { sharedWorkspaces: workspaceId } } 
    );

    return {
      _id: updatedWorkspace._id.toString(),
      title: updatedWorkspace.title,
      workspaceOwner: updatedWorkspace.workspaceOwner.toString(),
      icon: updatedWorkspace.icon?.toString() || undefined,
      collaborators:
        updatedWorkspace.collaborators?.map((collaborator) => ({
          email: collaborator.email as string,
          role: collaborator.role || undefined,
        })) || undefined,
      documents:
        updatedWorkspace.documents?.map((document) => document.toString()) ||
        undefined,
      createdAt: updatedWorkspace.createdAt,
      updatedAt: updatedWorkspace.updatedAt,
    }
  }
  async findUserAttachmentByEmail(
    userEmail: string
  ): Promise<UserAttachment | null> {
    const userAttachment = await UserAttachmentModel.findOne({
      userId: userEmail,
    })

    if (!userAttachment) {
      return null
    }

    return {
      userId: userAttachment.userId.toString(),
      sharedWorkspaces: userAttachment.sharedWorkspaces.map((workspace) =>
        workspace._id.toString()
      ),
    }
  }
}
