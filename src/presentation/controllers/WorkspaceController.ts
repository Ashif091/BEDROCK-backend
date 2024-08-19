import {NextFunction, Request, Response} from "express"
import {IWorkspaceService} from "../../interfaces/IWorkspaceService"
import {Workspace} from "../../entities/Workspace"

export class WorkspaceController {
  private workspaceService: IWorkspaceService

  constructor(workspaceService: IWorkspaceService) {
    this.workspaceService = workspaceService
  }

  async onCreateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const {name, userId} = req.body
      const data: Workspace = {
        title: name.trim(),
        workspaceOwner: userId,
      }
      if (name.trim().length === 0) {
        return res.status(409).json({error: "Enter valid name"})
      }
      if (!this.workspaceService.isWorkspaceNameAvailable(data)) {
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
      const ownerId = req.body.userId

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
      const {name, userId} = req.body
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
}
