"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../api";
import { signIn } from "next-auth/react";
import { getErrorMessage } from "@/utils";

const signupSchema = z
  .object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        await signup(value.email, value.password);

        const result = await signIn("credentials", {
          email: value.email,
          password: value.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Login failed after signup");
        } else {
          router.push("/dashboard");
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Signup failed");
      }
    },
    validators: {
      onSubmit: signupSchema,
    },
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

      <div>
        <form.Field
          name="confirmPassword"
          children={(field) => (
            <>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
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
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        )}
      />
    </form>
  );
}
