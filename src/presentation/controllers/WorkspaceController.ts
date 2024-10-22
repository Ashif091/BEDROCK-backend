import {NextFunction, Request, Response} from "express"
import {IWorkspaceService} from "../../interfaces/IWorkspaceService"
import {Workspace} from "../../entities/Workspace"
import { Server } from "socket.io"; 
export class WorkspaceController {
  private workspaceService: IWorkspaceService

  constructor(workspaceService: IWorkspaceService) {
    this.workspaceService = workspaceService
  }

  async onCreateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId as string
      const {name} = req.body
      const data: Workspace = {
        title: name.trim(),
        workspaceOwner: userId,
      }
      if (name.trim().length === 0) {
        return res.status(409).json({error: "Enter valid name"})
      }
      const isAvailable = await this.workspaceService.isWorkspaceNameAvailable(
        data
      )
      if (isAvailable) {
        return res.status(409).json({error: "workspaceService Already exits"})
      }
      const response = await this.workspaceService.createWorkspace(data)
      return res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }
  async getAllWorkspacesByOwner(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const ownerId = req.userId

      if (!ownerId) {
        return res.status(400).json({error: "Workspace owner ID is required"})
      }
      const workspaces = await this.workspaceService.getAllWorkspacesByOwner(
        ownerId
      )
      return res.status(200).json(workspaces)
    } catch (error) {
      next(error)
    }
  }

  async onGetWorkspaceById(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.params.id
      const workspace = await this.workspaceService.findWorkspaceById(
        workspaceId
      )
      if (!workspace) {
        return res.status(404).json({error: "Workspace not found"})
      }
      return res.json(workspace)
    } catch (error) {
      next(error)
    }
  }

  async onUpdateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("workspace update req with data ", req.body)

      const workspaceId = req.params.id
      const updateData: Partial<Workspace> = req.body
      const updatedWorkspace = await this.workspaceService.updateWorkspace(
        workspaceId,
        updateData
      )
      if (!updatedWorkspace) {
        return res.status(404).json({error: "Workspace not found"})
      }
      return res.json(updatedWorkspace)
    } catch (error) {
      next(error)
    }
  }
  async checkWorkspaceNameAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.userId as string
      const {name} = req.body
      console.log("daata : ", name, userId)

      if (!name || !userId) {
        return res
          .status(400)
          .json({error: "Workspace name and user ID are required"})
      }
      const data: Workspace = {
        title: name.trim(),
        workspaceOwner: userId,
      }

      const isAvailable = await this.workspaceService.isWorkspaceNameAvailable(
        data
      )
      console.log("status :", isAvailable)

      if (isAvailable) {
        return res.status(200).json({available: true})
      } else {
        return res.status(200).json({available: false})
      }
    } catch (error) {
      next(error)
    }
  }

  async liveblocksAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId as string
      const userData = await this.workspaceService.userInfo(userId)
      const userInfo = {
        _id: userData?._id,
        name: userData?.fullname,
        email: userData?.email,
        avatar: userData?.profile || undefined,
      }
      const {room, workspaceId} = req.body
      const sessionData =
        await this.workspaceService.authorizeLiveblocksSession(
          userInfo,
          room,
          workspaceId
        )
      return res.status(200).json(sessionData)
    } catch (error) {
      next(error)
    }
  }

  async onUpdateMember(req: Request, res: Response, next: NextFunction) {
    try {
      const {email, workspaceId, role} = req.body

      if (!email || email.trim().length === 0) {
        return res.status(400).json({error: "Email is required"})
      }

      const workspace = await this.workspaceService.findWorkspaceById(
        workspaceId
      )
      if (!workspace) {
        return res.status(404).json({error: "Workspace not found"})
      }

      if (workspace.collaborators?.includes(email)) {
        return res.status(409).json({error: "Collaborator already exists"})
      }
      const updatedWorkspace =
        await this.workspaceService.addCollaboratorToWorkspace(
          workspaceId,
          email,
          role
        )

      if (!updatedWorkspace) {
        return res.status(500).json({error: "Failed to add collaborator"})
      }
      const ownerData = await this.workspaceService.findOwnerById(workspace.workspaceOwner)
      const notificationData = {
        workspaceName: workspace.title,
        workspaceIcon: workspace.icon,
        userAddedBy:ownerData,
        role
      };

      // Emit to the room associated with the user's email
      req.io.to(email).emit("user-added", notificationData);

      return res.status(200).json(updatedWorkspace)
    } catch (error) {
      next(error)
    }
  }
  async onRemoveMember(req: Request, res: Response) {
    const {workspaceId, email} = req.body

    try {
      const updatedWorkspace = await this.workspaceService.onRemoveMember(
        workspaceId,
        email
      )

      if (!updatedWorkspace) {
        return res
          .status(404)
          .json({message: "Workspace or collaborator not found"})
      }

      return res.status(200).json({
        message: "Collaborator removed successfully",
        workspace: updatedWorkspace,
      })
    } catch (error) {
      console.error("Error removing collaborator:", error)
      return res
        .status(500)
        .json({message: "An error occurred while removing the collaborator"})
    }
  }

  async onGetAttachmentByEmail(req: Request, res: Response): Promise<void> {
    const userEmail = req.params.email

    try {
      const userAttachment =
        await this.workspaceService.getUserAttachmentByEmail(userEmail)

      if (!userAttachment) {
        res.status(200).json({})
        return
      }

      res.status(200).json(userAttachment)
    } catch (error) {
      console.error("Error fetching user attachment:", error)
      res.status(500).json({message: "Server error"})
    }
  }
  async onFindOwnerById(req: Request, res: Response): Promise<any> {
    try {
      const {ownerId} = req.params
      const ownerData = await this.workspaceService.findOwnerById(ownerId)

      if (!ownerData) {
        return res.status(404).json({message: "Owner not found"})
      }

      return res.status(200).json(ownerData)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message: "Internal server error"})
    }
  }
  async onSearchRole(req: Request, res: Response): Promise<void> {
    try {
      const {workspaceId, email} = req.body

      const role = await this.workspaceService.searchRoleByEmail(
        workspaceId,
        email
      )

      if (role) {
        res.status(200).json(role)
      } else {
        res
          .status(404)
          .json({message: "Collaborator not found or no role assigned."})
      }
    } catch (error) {
      res.status(500).json({message: "Server error", error})
    }
  }
}
