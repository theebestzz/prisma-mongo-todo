"use client";

import React from "react";

import { createTodo } from "@/app/actions";

import { LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(20, {
      message: "Title must be less than 20 characters.",
    }),
});

export function AddTodo() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.title) toast.error("Please enter a title");
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    await createTodo(formData);
    setLoading(false);
    toast.success("To do added successfully");
    form.reset();
  }

  return (
    <div className="mt-20 space-y-10">
      <h1 className="animate-pulse text-center text-lg font-semibold lg:text-2xl">
        Next.js 14 + Prisma + MongoDB <br /> TO DO App
      </h1>
      <div className="mx-auto w-full max-lg:px-5 lg:w-1/2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter a title" {...field} />
                  </FormControl>
                  <FormDescription>This is todo title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <LoaderCircle className="h-6 w-6 animate-spin" />
              ) : (
                "Add Todo"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
