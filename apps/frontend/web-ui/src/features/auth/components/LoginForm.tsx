"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { getErrorMessage } from "@/utils";

const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }), 
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        const result = await signIn("credentials", {
          email: value.email,
          password: value.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      } catch (err) {
        setError("An error occurred during login");
      }
    },
    validators: {
      onSubmit: loginSchema,
    }
    
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 w-full max-w-md"
    >
      <div>
        <form.Field
          name="email"
          children={(field) => (
            <>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {getErrorMessage(field.state.meta.errors) && (
                <p className="mt-1 text-sm text-red-600">
                  {getErrorMessage(field.state.meta.errors)}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <form.Field
          name="password"
          children={(field) => (
            <>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id={field.name}
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {getErrorMessage(field.state.meta.errors) && (
                <p className="mt-1 text-sm text-red-600">
                  {getErrorMessage(field.state.meta.errors)}
                </p>
              )}
            </>
          )}
        />
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        )}
      />
    </form>
  );
}
