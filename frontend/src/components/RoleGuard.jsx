import { useSelector } from "react-redux";

import { selectUserRole } from "../features/auth/authSlice";
import LoadingScreen from "./LoadingScreen";
import { Card, CardContent } from "./ui/card";

const RoleGuard = ({ allowedRoles, children, fallback = null }) => {
  const role = useSelector(selectUserRole);

  if (!role) {
    return <LoadingScreen message="Menyiapkan peran pengguna" />;
  }

  if (allowedRoles.includes(role)) {
    return children;
  }

  return (
    fallback ?? (
      <Card className="border-destructive/40 bg-destructive/10">
        <CardContent className="text-sm text-destructive">
          Anda tidak memiliki hak akses untuk halaman ini.
        </CardContent>
      </Card>
    )
  );
};

export default RoleGuard;
