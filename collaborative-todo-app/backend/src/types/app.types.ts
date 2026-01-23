export interface ICollaborator {
  userId: string;
  role: "viewer" | "editor" | "admin";
}

export interface IHistoryItem {
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
}

export interface ITodo {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  version: number;
  lastModified: number;
  clientId: string;
  boardId: string;
  order: number;
  metadata: Record<string, string>;
  history: IHistoryItem[];
  createdBy: string;
  createdByName?: string;
  lastModifiedByName?: string;
}

export interface ICreateTodoDto {
  text: string;
  description?: string;
  clientId: string;
  metadata?: Record<string, string>;
  boardId?: string;
}

export interface IUpdateTodoDto {
  text?: string;
  description?: string;
  completed?: boolean;
  version: number;
  lastModified: number;
  order?: number;
  metadata?: Record<string, string>;
}

export interface IAddCollaboratorDto {
  email: string; 
  role: "viewer" | "editor" | "admin";
}

export interface IUserPayload {
  userId: string;
  email: string;
  role: string;
  tokenVersion: number;
}

export interface IValidationError {
  field: string;
  message: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
