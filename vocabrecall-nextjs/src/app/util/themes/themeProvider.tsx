import defaultThemes from './defaultThemes.json';

export type ThemeName = keyof typeof defaultThemes;
export type Themes = typeof defaultThemes;

interface CustomTheme {
  name: string;
  [key: string]: string;
}

export type CombinedTheme = Record<string, string>;
export type AllThemes = Record<string, CombinedTheme>;

// set a single css variable
export function setCSSVariable(name: string, value: string): void {
  if(typeof window !== 'undefined') {
    document.documentElement.style.setProperty(name, value);
    localStorage.setItem(name, value);
  }
}

// update all css variables for a theme name
export function setTheme(themeName: string): void {
  const allThemes = getAllThemes();
  const theme = allThemes[themeName];
  if(!theme) return;

  Object.entries(theme).forEach(([key, value]) => {
    if(key.startsWith('--')){
      setCSSVariable(key, value);
    } else {
      console.log(key, value)
      localStorage.setItem('notify', value);
    }
    
  });
  localStorage.setItem('active-theme', themeName);
}

// return all themes
export function getAllThemes(): AllThemes {
  let customThemes: CustomTheme[] = [];

  if(typeof window !== 'undefined'){
    const stored = localStorage.getItem('custom-themes');
    if(stored){
      try {
        customThemes = JSON.parse(stored);
      } catch {
        console.error('Failed to get custom themes from local storage');
      }
    }
  }

  const customThemeObj: Record<string, CombinedTheme> = {};
  for(const t of customThemes){
    const { name, ...vars } = t;
    customThemeObj[name] = vars;
  }

  return {
    ...defaultThemes,
    ...customThemeObj
  };
}

// return all theme names
export function getThemeNames(): string[] { return Object.keys(getAllThemes()); }

// return the current selected theme
export function getCurrentTheme(): string {
  if(typeof window === 'undefined') return 'dark';
  return localStorage.getItem('active-theme') || 'dark';
}

// return if a theme is default or custom
export function isDefaultTheme(themeName: string): boolean { return Object.prototype.hasOwnProperty.call(defaultThemes, themeName); }