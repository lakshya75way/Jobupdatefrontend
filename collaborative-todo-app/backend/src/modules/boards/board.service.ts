import Board, { IBoard } from "../../models/board.model.js";
import User, { IUser } from "../../models/user.model.js";
import { AppError } from "../../middlewares/error.middleware.js";
import mongoose from "mongoose";
import * as emailService from "../../utils/email.util.js";



export const createBoard = async (
  name: string,
  ownerId: string
): Promise<IBoard> => {
  const board = await Board.create({
    name,
    owner: ownerId,
    collaborators: [],
  });
  return board;
};

export const getUserBoards = async (userId: string): Promise<IBoard[]> => {
  const boards = await Board.find({
    $or: [
      { owner: userId },
      {
        collaborators: {
          $elemMatch: { userId: userId, status: "accepted" },
        },
      },
    ],
  })
    .populate("owner", "name email")
    .populate("collaborators.userId", "name email");
  return boards;
};

export const getPendingInvites = async (userId: string): Promise<IBoard[]> => {
  return await Board.find({
    owner: { $ne: userId },
    collaborators: {
      $elemMatch: {
        userId: userId,
        status: "pending",
      },
    },
  }).populate("owner", "name email");
};

export const getBoardById = async (
  boardId: string,
  userId: string
): Promise<IBoard | null> => {
  const board = await Board.findOne({
    _id: boardId,
    $or: [
      { owner: userId },
      {
        collaborators: {
          $elemMatch: { userId: userId, status: "accepted" },
        },
      },
    ],
  })
    .populate("owner", "name email")
    .populate("collaborators.userId", "name email");
  return board;
};

export const inviteUser = async (
  boardId: string,
  email: string,
  role: "viewer" | "editor" | "admin",
  requesterId: string
): Promise<IBoard> => {
  const board = await Board.findById(boardId).populate("owner");
  if (!board) throw new AppError("Board not found", 404);

  
  const isOwner = board.owner._id.toString() === requesterId;
  const requesterCollaborator = board.collaborators.find(
    (c) => c.userId.toString() === requesterId && c.status === "accepted"
  );
  const isAdmin = requesterCollaborator?.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new AppError("You do not have permission to invite users", 403);
  }

  const userToInvite = await User.findOne({ email });
  if (!userToInvite) {
    throw new AppError(
      `User with email ${email} does not exist. They must sign up first.`,
      404
    );
  }

  if (userToInvite._id.toString() === board.owner._id.toString()) {
    throw new AppError("Cannot invite the board owner", 400);
  }

  const alreadyCollaborator = board.collaborators.some(
    (c) => c.userId.toString() === userToInvite._id.toString()
  );

  if (alreadyCollaborator) {
    throw new AppError(
      "User is already a collaborator or has a pending invite",
      400
    );
  }

  board.collaborators.push({
    userId: userToInvite._id as mongoose.Types.ObjectId,
    role,
    status: "pending",
  });
  await board.save();

  const ownerName = (board.owner as unknown as IUser).name || "Someone";
  await emailService.sendBoardInvitation(
    email,
    ownerName,
    board.name,
    board._id.toString()
  );

  return board as unknown as IBoard;
};

export const acceptInvitation = async (
  boardId: string,
  userId: string
): Promise<IBoard> => {
  const board = await Board.findById(boardId);
  if (!board) throw new AppError("Board not found", 404);

  const collaborator = board.collaborators.find(
    (c) => c.userId.toString() === userId && c.status === "pending"
  );

  if (!collaborator) {
    throw new AppError("No pending invitation found for this board", 404);
  }

  collaborator.status = "accepted";
  await board.save();
  return board as unknown as IBoard;
};

export const removeCollaborator = async (
  boardId: string,
  userIdToRemove: string,
  requesterId: string
): Promise<IBoard> => {
  const board = await Board.findById(boardId);
  if (!board) throw new AppError("Board not found", 404);

  if (board.owner.toString() !== requesterId) {
    throw new AppError("Only the board owner can remove collaborators", 403);
  }

  if (board.owner.toString() === userIdToRemove) {
    throw new AppError("Owner cannot be removed from the board", 400);
  }

  board.collaborators = board.collaborators.filter(
    (c) => c.userId.toString() !== userIdToRemove
  );
  await board.save();

  return board;
};

export const updateCollaboratorRole = async (
  boardId: string,
  userIdToUpdate: string,
  newRole: "viewer" | "editor" | "admin",
  requesterId: string
): Promise<IBoard> => {
  const board = await Board.findById(boardId);
  if (!board) throw new AppError("Board not found", 404);

  
  if (board.owner.toString() !== requesterId) {
    throw new AppError("Only the board owner can change roles", 403);
  }

  const collaborator = board.collaborators.find(
    (c) => c.userId.toString() === userIdToUpdate
  );

  if (!collaborator) {
    throw new AppError("Collaborator not found on this board", 404);
  }

  collaborator.role = newRole;
  await board.save();

  return board;
};
