import { useState } from "react";
import {
  applyTheme,
  getPreferredTheme,
  persistTheme,
  THEME_DARK,
  THEME_LIGHT,
} from "./theme.js";
import { ThemeContext } from "./ThemeContext.js";

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const initialTheme = getPreferredTheme();

    applyTheme(initialTheme);

    return initialTheme;
  });

  const setTheme = (nextTheme) => {
    const resolvedTheme = nextTheme === THEME_LIGHT ? THEME_LIGHT : THEME_DARK;

    applyTheme(resolvedTheme);
    persistTheme(resolvedTheme);
    setThemeState(resolvedTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === THEME_DARK ? THEME_LIGHT : THEME_DARK);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark: theme === THEME_DARK,
        setTheme,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
