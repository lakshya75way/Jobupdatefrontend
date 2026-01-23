import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  userId: mongoose.Types.ObjectId;
  path: string;
  createdAt: Date;
}

const FileSchema: Schema = new Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  path: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFile>("File", FileSchema);
