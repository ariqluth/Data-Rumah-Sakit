import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") ?? "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      <Sun className={cn("h-4 w-4", theme === "dark" ? "hidden" : "block")} />
      <Moon className={cn("h-4 w-4", theme === "dark" ? "block" : "hidden")} />
    </Button>
  );
};

export default ThemeToggle;
