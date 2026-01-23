import { Router } from "express";
import {
  createBoard,
  getUserBoards,
  getPendingInvites,
  getBoardById,
  inviteUser,
  acceptInvitation,
  removeCollaborator,
  updateCollaboratorRole,
} from "./board.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/", createBoard);
router.get("/", getUserBoards);
router.get("/invites", getPendingInvites);
router.get("/:id", getBoardById);
router.post("/:id/invite", inviteUser);
router.post("/:id/accept", acceptInvitation);
router.delete("/:id/collaborators/:userId", removeCollaborator);
router.patch("/:id/collaborators/:userId", updateCollaboratorRole);

export default router;
