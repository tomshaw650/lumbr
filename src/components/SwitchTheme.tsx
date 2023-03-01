import { useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { useLocalStorage } from "usehooks-ts";
const SwitchTheme = () => {
  //we store the theme in localStorage to preserve the state on next visit with an initial theme of dark.
  const [theme, setTheme] = useLocalStorage("lumbr", "dark");
  //toggles the theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "lumbr" : "dark");
  };

  //modify data-theme attribute on document.body when theme changes
  useEffect(() => {
    const html = document.querySelector("html");
    html?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <button className="btn-circle btn" onClick={toggleTheme}>
      {theme === "dark" ? (
        <FiMoon className="h-5 w-5" />
      ) : (
        <FiSun className="h-5 w-5" />
      )}
    </button>
  );
};
export default SwitchTheme;
