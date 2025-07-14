const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(date: Date | string | number): string {
  const parsedDate =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return formatter.format(parsedDate);
}
