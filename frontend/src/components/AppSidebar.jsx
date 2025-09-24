import { LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "../lib/utils";

const navItems = [{ to: "/", icon: LayoutDashboard, label: "Dashboard" }];

const AppSidebar = () => {
  return (
    <aside className="hidden border-r bg-muted/40 px-3 py-6 md:flex md:w-16 lg:w-20">
      <nav className="flex flex-1 flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
          RS
        </div>
        <div className="mt-6 flex flex-1 flex-col items-center gap-3 text-xs text-muted-foreground">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex h-12 w-12 items-center justify-center rounded-md border transition",
                    isActive ? "border-primary bg-primary/10 text-primary" : "border-transparent hover:bg-muted"
                  )
                }
              >
                <span className="flex flex-col items-center gap-1">
                  <Icon className="h-5 w-5" />
                  <span className="hidden text-[11px] lg:block">{item.label}</span>
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default AppSidebar;
