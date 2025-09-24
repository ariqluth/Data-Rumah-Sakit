import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";

import { selectUserRole } from "../features/auth/authSlice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ThemeToggle from "./ThemeToggle";

const AppHeader = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const role = useSelector(selectUserRole);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-foreground">Rumah Sakit</span>
        {role ? <Badge variant="secondary" className="uppercase">{role}</Badge> : null}
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs leading-tight md:block">
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={user.picture} alt={user.name} />
              <AvatarFallback>{user.name?.slice(0, 2)?.toUpperCase() ?? "RS"}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Keluar
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => loginWithRedirect()}>
            Masuk
          </Button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
