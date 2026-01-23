import type { Request, Response } from "express";
import * as boardService from "./board.service.js";
import { catchAsync } from "../../middlewares/error.middleware.js";
import {
  createBoardSchema,
  inviteUserSchema,
  boardIdSchema,
  removeCollaboratorSchema,
  updateCollaboratorRoleSchema,
} from "./board.validation.js";

export const createBoard = catchAsync(async (req: Request, res: Response) => {
  await createBoardSchema.parseAsync({ body: req.body });
  const { name } = req.body;
  const board = await boardService.createBoard(name, req.user!.userId);

  res.status(201).json({
    status: "success",
    data: { board },
  });
});

export const getUserBoards = catchAsync(async (req: Request, res: Response) => {
  const boards = await boardService.getUserBoards(req.user!.userId);

  res.status(200).json({
    status: "success",
    data: { boards },
  });
});

export const getPendingInvites = catchAsync(
  async (req: Request, res: Response) => {
    const boards = await boardService.getPendingInvites(req.user!.userId);

    res.status(200).json({
      status: "success",
      data: { boards },
    });
  }
);

export const getBoardById = catchAsync(async (req: Request, res: Response) => {
  await boardIdSchema.parseAsync({ params: req.params });
  const board = await boardService.getBoardById(
    req.params.id,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    data: { board },
  });
});

export const inviteUser = catchAsync(async (req: Request, res: Response) => {
  await inviteUserSchema.parseAsync({ body: req.body, params: req.params });
  const { email, role } = req.body;
  const board = await boardService.inviteUser(
    req.params.id,
    email,
    role,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Invitation sent successfully",
    data: { board },
  });
});

export const acceptInvitation = catchAsync(
  async (req: Request, res: Response) => {
    await boardIdSchema.parseAsync({ params: req.params });
    const board = await boardService.acceptInvitation(
      req.params.id,
      req.user!.userId
    );

    const io = req.app.get("io");
    if (io) {
      io.to(req.params.id).emit("board-updated", board);
    }

    res.status(200).json({
      status: "success",
      message: "Invitation accepted",
      data: { board },
    });
  }
);

export const removeCollaborator = catchAsync(
  async (req: Request, res: Response) => {
    await removeCollaboratorSchema.parseAsync({ params: req.params });
    const board = await boardService.removeCollaborator(
      req.params.id,
      req.params.userId,
      req.user!.userId
    );

    const io = req.app.get("io");
    if (io) {
      io.to(req.params.id).emit("board-updated", board);
    }

    res.status(200).json({
      status: "success",
      data: { board },
    });
  }
);

export const updateCollaboratorRole = catchAsync(
  async (req: Request, res: Response) => {
    await updateCollaboratorRoleSchema.parseAsync({
      body: req.body,
      params: req.params,
    });
    const { role } = req.body;
    const board = await boardService.updateCollaboratorRole(
      req.params.id,
      req.params.userId,
      role,
      req.user!.userId
    );

    const io = req.app.get("io");
    if (io) {
      io.to(req.params.id).emit("board-updated", board);
    }

    res.status(200).json({
      status: "success",
      message: "Collaborator role updated",
      data: { board },
    });
  }
);
