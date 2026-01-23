import mongoose, { Schema, Document } from "mongoose";

export interface IHistoryItem {
  action: string;
  performedBy: mongoose.Types.ObjectId;
  timestamp: Date;
  details?: string;
}

export interface ITodoDocument extends Document {
  todoId: string;
  text: string;
  description?: string;
  completed: boolean;
  version: number;
  lastModified: number;
  clientId: string;
  userId: mongoose.Types.ObjectId; 
  boardId: mongoose.Types.ObjectId; 
  order: number;
  metadata: Map<string, string>;
  history: IHistoryItem[];
  createdBy: mongoose.Types.ObjectId;
  lastModifiedBy?: mongoose.Types.ObjectId;
}

const TodoSchema: Schema = new Schema(
  {
    todoId: { type: String, required: true, unique: true, index: true },
    text: { type: String, required: true, maxlength: 500 },
    description: { type: String, maxlength: 2000 },
    completed: { type: Boolean, default: false },
    version: { type: Number, default: 0 },
    lastModified: { type: Number, required: true, index: true },
    clientId: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    metadata: { type: Map, of: String, default: {} },
    history: [
      {
        action: { type: String, required: true },
        performedBy: { type: Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        details: String,
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
    lastModifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

TodoSchema.index({ boardId: 1, order: 1 });

export default mongoose.model<ITodoDocument>("Todo", TodoSchema);
