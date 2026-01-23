import { db } from "../../services/database.service";
import type { ITodo } from "../../types/common.types";




export const getAll = async (): Promise<ITodo[]> => {
  return await db.todos.orderBy("order").toArray();
};


export const getByBoardId = async (boardId: string): Promise<ITodo[]> => {
  return await db.todos.where("boardId").equals(boardId).sortBy("order");
};


export const getById = async (id: string): Promise<ITodo | undefined> => {
  return await db.todos.get(id);
};


export const create = async (todo: ITodo): Promise<void> => {
  await db.todos.add(todo);
};


export const update = async (todo: ITodo): Promise<void> => {
  await db.todos.put(todo);
};


export const deleteTodo = async (id: string): Promise<void> => {
  await db.todos.delete(id);
};


export const syncWithRemote = async (remoteTodo: ITodo): Promise<boolean> => {
  const localTodo = await getById(remoteTodo.id);

  if (!localTodo) {
    await create(remoteTodo);
    return true;
  }

  if (
    remoteTodo.version > localTodo.version ||
    (remoteTodo.version === localTodo.version &&
      remoteTodo.lastModified > localTodo.lastModified)
  ) {
    await update(remoteTodo);
    return true;
  }

  return false;
};
