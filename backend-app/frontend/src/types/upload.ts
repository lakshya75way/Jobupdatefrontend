export interface UserFile {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  userId: string;
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  status: string;
  data: UserFile;
}

export interface GetFilesResponse {
  status: string;
  results: number;
  data: UserFile[];
}
