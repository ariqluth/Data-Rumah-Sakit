import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE_URL } from "../../services/config";

const baseState = {
  items: [],
  total: 0,
  status: "idle",
  filters: {
    name: "",
    startDate: null,
    endDate: null,
  },
  report: {
    patients: [],
    summary: {
      total_patients: 0,
      total_today: 0,
    },
  },
  current: null,
  error: null,
};

const clone = (value) =>
  typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const initialState = clone(baseState);

const buildAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const ensureToken = (getState) => {
  const token = getState().auth.accessToken;
  if (!token) {
    throw new Error("Missing access token");
  }
  return token;
};

export const fetchPatients = createAsyncThunk(
  "patients/fetchList",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const token = ensureToken(getState);
      const searchParams = new URLSearchParams();
      const { name, startDate, endDate } = params;
      if (name) searchParams.set("name", name);
      if (startDate) searchParams.set("start_date", startDate);
      if (endDate) searchParams.set("end_date", endDate);
      const query = searchParams.toString();
      const url = query ? `/patients?${query}` : "/patients";
      const { data } = await axios.get(`${API_BASE_URL}${url}`, {
        headers: buildAuthHeaders(token),
      });
      return { data, params };
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  "patients/fetchById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = ensureToken(getState);
      const { data } = await axios.get(`${API_BASE_URL}/patients/${id}`, {
        headers: buildAuthHeaders(token),
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  }
);

export const createPatient = createAsyncThunk(
  "patients/create",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = ensureToken(getState);
      const { data } = await axios.post(`${API_BASE_URL}/patients`, payload, {
        headers: buildAuthHeaders(token),
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  }
);

export const updatePatient = createAsyncThunk(
  "patients/update",
  async ({ id, payload }, { getState, rejectWithValue }) => {
    try {
      const token = ensureToken(getState);
      const { data } = await axios.put(`${API_BASE_URL}/patients/${id}`, payload, {
        headers: buildAuthHeaders(token),
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  }
);

export const deletePatient = createAsyncThunk(
  "patients/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = ensureToken(getState);
      await axios.delete(`${API_BASE_URL}/patients/${id}`, {
        headers: buildAuthHeaders(token),
      });
      return id;
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  }
);

export const fetchPatientReport = createAsyncThunk(
  "patients/fetchReport",
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const token = ensureToken(getState);
      const searchParams = new URLSearchParams();
      const { name, startDate, endDate } = params;
      if (name) searchParams.set("name", name);
      if (startDate) searchParams.set("start_date", startDate);
      if (endDate) searchParams.set("end_date", endDate);
      const query = searchParams.toString();
      const url = query ? `/reports/patients?${query}` : "/reports/patients";
      const { data } = await axios.get(`${API_BASE_URL}${url}`, {
        headers: buildAuthHeaders(token),
      });
      return { data, params };
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  }
);

export const importPatients = createAsyncThunk(
  "patients/import",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const token = ensureToken(getState);
      const { data } = await axios.post(`${API_BASE_URL}/integrations/patients/import`, payload, {
        headers: buildAuthHeaders(token),
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.detail ?? error.message;
      return rejectWithValue(message);
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetPatientsState: () => clone(baseState),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data.items;
        state.total = action.payload.data.total;
        state.filters = {
          ...state.filters,
          ...action.payload.params,
        };
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load patients";
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
        state.current = action.payload;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        const index = state.items.findIndex((patient) => patient.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.current = action.payload;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.items = state.items.filter((patient) => patient.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        if (state.current?.id === action.payload) {
          state.current = null;
        }
      })
      .addCase(fetchPatientReport.fulfilled, (state, action) => {
        state.report = action.payload.data;
      })
      .addCase(importPatients.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(importPatients.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(importPatients.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Import gagal";
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected") && action.type.startsWith("patients/"),
        (state, action) => {
          state.error = action.payload ?? "Operation failed";
        }
      );
  },
});

export const { setFilters, resetPatientsState } = patientSlice.actions;

export default patientSlice.reducer;
