"use client";

import React, { useState } from "react";
import { Todo } from "@/types/types";
import { updateTodoStatus, editTodo, deleteTodo } from "@/app/actions";
import { Edit2, LoaderCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function TodoLists({ todos }: { todos: Todo[] }) {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState<string>("");

  async function handleStatusChange(id: string, completed: boolean) {
    setLoading((prev) => ({ ...prev, [id + "_status"]: true }));
    await updateTodoStatus(id, completed);
    toast.success("Todo updated successfully");
    setLoading((prev) => ({ ...prev, [id + "_status"]: false }));
  }

  async function handleEditTodo() {
    if (editingTodo) {
      setLoading((prev) => ({ ...prev, [editingTodo.id + "_edit"]: true }));
      await editTodo(editingTodo.id, newTitle);
      toast.success("Todo title updated successfully");
      setEditingTodo(null);
      setNewTitle("");
      setLoading((prev) => ({ ...prev, [editingTodo.id + "_edit"]: false }));
    }
  }

  async function handleDeleteTodo(id: string) {
    setLoading((prev) => ({ ...prev, [id + "_delete"]: true }));
    await deleteTodo(id);
    toast.success("Todo deleted successfully");
    setLoading((prev) => ({ ...prev, [id + "_delete"]: false }));
  }

  return (
    <div className="mx-auto mt-20 grid w-full flex-col gap-5 max-lg:px-5 lg:w-1/2 lg:grid-cols-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={cn(
            "flex w-full flex-col items-center justify-center space-y-5 rounded-md bg-secondary p-5",
          )}
        >
          <p
            className={cn(
              "text-2xl font-semibold",
              todo.completed && "text-primary line-through",
            )}
          >
            {todo.title}
          </p>
          <Button
            className="flex w-full items-center gap-2 text-lg"
            variant="outline"
            onClick={() => {
              setEditingTodo(todo);
              setNewTitle(todo.title || "");
            }}
          >
            Edit <Edit2 size={20} color="blue" />
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleDeleteTodo(todo.id)}
            disabled={loading[todo.id + "_delete"]}
          >
            {loading[todo.id + "_delete"] ? (
              <span className="flex items-center gap-2">
                Deleting
                <LoaderCircle className="h-5 w-5 animate-spin" />
              </span>
            ) : (
              <span className="flex items-center gap-2 text-lg">
                Delete <Trash2 size={20} color="red" />
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleStatusChange(todo.id, !todo.completed)}
            disabled={loading[todo.id + "_status"]}
            className={cn(
              "w-full",
              todo.completed
                ? "bg-primary text-white"
                : "bg-secondary text-primary hover:bg-secondary/90",
            )}
          >
            {loading[todo.id + "_status"] ? (
              <span className="flex items-center gap-2">
                Loading
                <LoaderCircle className="h-5 w-5 animate-spin" />
              </span>
            ) : todo.completed ? (
              "Completed"
            ) : (
              "Incomplete"
            )}
          </Button>
        </div>
      ))}

      {editingTodo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-white p-5">
            <h2 className="mb-4 text-xl">Edit Todo</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="mb-4 w-full rounded-md border border-gray-300 p-2"
            />
            <Button
              onClick={handleEditTodo}
              className="mr-2"
              disabled={loading[editingTodo.id + "_edit"]}
            >
              {loading[editingTodo.id + "_edit"] ? (
                <span className="flex items-center gap-2">
                  Saving
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                </span>
              ) : (
                "Save"
              )}
            </Button>
            <Button variant="outline" onClick={() => setEditingTodo(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
