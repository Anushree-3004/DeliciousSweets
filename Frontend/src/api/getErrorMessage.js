export function getErrorMessage(err) {
  // Axios errors
  const data = err?.response?.data;

  if (data?.error?.message) return data.error.message;
  if (data?.message) return data.message;

  if (err?.message) return err.message;
  return "Something went wrong";
}
