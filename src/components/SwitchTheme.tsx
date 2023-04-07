import { useEffect, useState } from "react";
import Head from "next/head";
import { FiMoon, FiSun } from "react-icons/fi";
import { useLocalStorage } from "usehooks-ts";

const SwitchTheme = () => {
  //we store the theme in localStorage to preserve the state on next visit with an initial theme of dark.
  const [theme, setTheme] = useLocalStorage("lumbr", "dark");
  const [mounted, setMounted] = useState(false);

  //toggles the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "lumbr" : "dark"));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <button className="btn-circle btn" onClick={toggleTheme}>
        {theme === "dark" ? (
          <FiMoon className="h-5 w-5" />
        ) : (
          <FiSun className="h-5 w-5" />
        )}
      </button>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = '${theme}';
                var html = document.querySelector('html');
                html.setAttribute('data-theme', theme);
                html.classList.remove(theme === 'dark' ? 'lumbr' : 'dark');
                html.classList.add(theme);
              })();
            `,
          }}
        />
      </Head>
    </>
  );
};

export default SwitchTheme;
