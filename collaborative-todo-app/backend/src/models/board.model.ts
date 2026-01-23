import mongoose, { Document, Schema } from "mongoose";

export interface IBoard extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  collaborators: {
    userId: mongoose.Types.ObjectId;
    role: "viewer" | "editor" | "admin";
    status: "pending" | "accepted";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: [true, "Board name is required"],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "editor", "admin"],
          default: "viewer",
        },
        status: {
          type: String,
          enum: ["pending", "accepted"],
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


boardSchema.index({ owner: 1 });
boardSchema.index({ "collaborators.userId": 1 });

export default mongoose.model<IBoard>("Board", boardSchema);
