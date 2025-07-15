export function getErrorMessage(errors: any[]): string | null {
  if (!errors || errors.length === 0) return null;
  
  const error = errors[0];
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return error?.toString() || 'An error occurred';
}