import { useEffect } from "react";

import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, loginWithRedirect]);

  return (
    <div className="grid min-h-[300px] place-items-center">
      <div className="text-center text-sm text-slate-500">
        <p>Mengarahkan ke halaman login...</p>
      </div>
    </div>
  );
};

export default Login;
