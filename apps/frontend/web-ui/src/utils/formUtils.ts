export const getErrorMessage = (errors: any[]): string | null => {
  if (errors.length === 0) return null;
  const error = errors[0];
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error)
    return error.message;
  return "Invalid value";
};
