import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import patientsReducer from "../features/patients/patientSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
  },
});

export const selectAuth = (state) => state.auth;
export const selectPatients = (state) => state.patients;
