import Dexie, { type Table } from "dexie";
import type { ITodo } from "../types/common.types";

class TodoDatabase extends Dexie {
  todos!: Table<ITodo>;

  constructor() {
    super("CollaborativeTodoDatabase");
    this.version(1).stores({
      todos: "id, text, completed, version, lastModified, clientId",
    });
    this.version(3).stores({
      todos:
        "id, text, completed, version, lastModified, clientId, order, boardId",
    });
  }
}

export const db = new TodoDatabase();
