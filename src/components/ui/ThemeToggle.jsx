import React from "react";
import { Sun, Moon } from "lucide-react";
import useTheme from "@/hooks/useTheme";

const ThemeToggle = React.memo(() => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-neutral-200 transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-neutral-700" />
      ) : (
        <Moon className="w-5 h-5 text-neutral-700" />
      )}
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
