export interface ICollaborator {
  userId: string | { _id: string; name: string; email: string };
  role: "viewer" | "editor" | "admin";
  status: "pending" | "accepted";
}

export interface IHistoryItem {
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: string;
}

export interface IBoard {
  _id: string;
  name: string;
  owner: string | { _id: string; name: string; email: string };
  collaborators: ICollaborator[];
  createdAt: string;
  updatedAt: string;
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

export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ISyncEvent {
  type: "todo-updated" | "sync-error";
  payload: ITodo | { message: string };
}
