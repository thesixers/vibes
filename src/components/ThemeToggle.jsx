import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react"; // Or use your own icons

export default function ThemeToggle() {
  // Check local storage or system preference on load
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white transition-colors duration-300 no-drag"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </button>
  );
}