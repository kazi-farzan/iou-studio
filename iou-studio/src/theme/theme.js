export const THEME_STORAGE_KEY = "iou-theme";
export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";

function getSystemTheme() {
  if (typeof window === "undefined") {
    return THEME_DARK;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME_DARK
    : THEME_LIGHT;
}

export function getPreferredTheme() {
  if (typeof window === "undefined") {
    return THEME_DARK;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === THEME_LIGHT || storedTheme === THEME_DARK) {
    return storedTheme;
  }

  return getSystemTheme();
}

export function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const resolvedTheme = theme === THEME_LIGHT ? THEME_LIGHT : THEME_DARK;

  root.dataset.theme = resolvedTheme;
  root.classList.toggle(THEME_DARK, resolvedTheme === THEME_DARK);
  root.style.colorScheme = resolvedTheme;
}

export function persistTheme(theme) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}
