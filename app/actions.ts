"use server";

import { Todo } from "@/types/types";
import { prisma } from "@/utils/prisma";
import { revalidateTag, unstable_noStore } from "next/cache";

export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;

  await prisma.todo.create({
    data: {
      title,
    },
  });

  revalidateTag("todos");
}

export async function getTodos(): Promise<Todo[]> {
  unstable_noStore();

  const todos = await prisma.todo.findMany();
  return todos.map((item) => ({
    id: item.id,
    title: item.title,
    completed: item.isCompleted,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}

export async function updateTodoStatus(id: string, isCompleted: boolean) {
  await prisma.todo.update({
    where: { id },
    data: { isCompleted },
  });

  revalidateTag("todos");
}

export async function editTodo(id: string, title: string) {
  await prisma.todo.update({
    where: { id },
    data: { title },
  });

  revalidateTag("todos");
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({
    where: { id },
  });

  revalidateTag("todos");
}
