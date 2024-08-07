"use client";

import React, { useState } from "react";
import { Todo } from "@/types/types";
import { updateTodoStatus } from "@/app/actions";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function TodoLists({ todos }: { todos: Todo[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleStatusChange(id: string, completed: boolean) {
    setLoading(id);
    await updateTodoStatus(id, completed);
    toast.success("To do updated successfully");
    setLoading(null);
  }

  return (
    <div className="mx-auto mt-20 grid w-full flex-col gap-5 max-lg:px-5 lg:w-1/2 lg:grid-cols-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={cn(
            "flex w-full flex-col items-center justify-between space-y-5 rounded-md bg-secondary p-5",
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
            variant="outline"
            onClick={() => handleStatusChange(todo.id, !todo.completed)}
            disabled={loading === todo.id}
            className={cn(
              "w-full",
              todo.completed
                ? "bg-primary text-white"
                : "bg-secondary text-primary hover:bg-secondary/90",
            )}
          >
            {loading === todo.id ? (
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
    </div>
  );
}
