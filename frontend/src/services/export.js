import axios from "axios";

import { API_BASE_URL } from "./config";

export const downloadPatientReport = async (token, filters = {}) => {
  const searchParams = new URLSearchParams();
  const { name, startDate, endDate } = filters;
  if (name) searchParams.set("name", name);
  if (startDate) searchParams.set("start_date", startDate);
  if (endDate) searchParams.set("end_date", endDate);
  const query = searchParams.toString();
  const url = query ? `${API_BASE_URL}/reports/patients/export?${query}` : `${API_BASE_URL}/reports/patients/export`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute("download", "patients-report.xlsx");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);
};
