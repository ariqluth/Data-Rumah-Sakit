import { format, isValid, parseISO } from "date-fns";

export const formatDate = (value, dateFormat = "dd MMM yyyy") => {
  if (!value) return "-";
  const dateValue = typeof value === "string" ? parseISO(value) : value;
  if (!isValid(dateValue)) return "-";
  return format(dateValue, dateFormat);
};

export const toISODate = (value) => {
  if (!value) return null;
  const dateValue = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(dateValue.getTime())) return null;
  return dateValue.toISOString().split("T")[0];
};
