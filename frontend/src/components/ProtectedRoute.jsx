import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";

import LoadingScreen from "./LoadingScreen";
import { useAppSelector } from "../hooks/storeHooks";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const authStatus = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || authStatus === "loading") {
    return <LoadingScreen message="Memuat halaman" />;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
