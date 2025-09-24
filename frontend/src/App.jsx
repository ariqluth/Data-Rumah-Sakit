import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";

import AppHeader from "./components/AppHeader";
import AppSidebar from "./components/AppSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import PatientsList from "./pages/PatientsList";
import PatientCreate from "./pages/PatientCreate";
import PatientEdit from "./pages/PatientEdit";
import Login from "./pages/Login";
import { useAppDispatch, useAppSelector } from "./hooks/storeHooks";
import {
  clearAuthState,
  fetchCurrentUser,
  setAccessToken,
  setAuthenticatedProfile,
} from "./features/auth/authSlice";
import { resetPatientsState } from "./features/patients/patientSlice";

const App = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated, user, getAccessTokenSilently, error: authError } = useAuth0();
  const authStatus = useAppSelector((state) => state.auth.status);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    let active = true;
    const syncSession = async () => {
      if (isLoading) return;
      if (!isAuthenticated) {
        dispatch(clearAuthState());
        dispatch(resetPatientsState());
        return;
      }
      try {
        const token = await getAccessTokenSilently();
        if (!active) return;
        dispatch(setAuthenticatedProfile(user));
        dispatch(setAccessToken(token));
      } catch (err) {
        console.error("Failed to get access token", err);
      }
    };

    syncSession();
    return () => {
      active = false;
    };
  }, [dispatch, getAccessTokenSilently, isAuthenticated, isLoading, user]);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser());
    }
  }, [accessToken, dispatch]);

  if (isLoading || (isAuthenticated && authStatus === "loading")) {
    return <LoadingScreen message="Menyiapkan sesi" />;
  }

  if (authError) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="w-full max-w-md space-y-2 rounded-lg border bg-card p-6 text-center text-card-foreground">
          <h1 className="text-lg font-semibold text-destructive">Kesalahan Autentikasi</h1>
          <p className="text-sm text-muted-foreground">{authError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="container space-y-6 py-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <ProtectedRoute>
                    <PatientsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/new"
                element={
                  <ProtectedRoute>
                    <PatientCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients/:id/edit"
                element={
                  <ProtectedRoute>
                    <PatientEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
