import { AddTodo } from "@/components/shared/add-todo";
import { TodoLists } from "@/components/shared/todo-lists";

import { getTodos } from "./actions";

export default async function Home() {
  const todos = await getTodos();
  return (
    <section>
      <AddTodo />
      <TodoLists todos={todos} />
    </section>
  );
}
