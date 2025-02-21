import type { StateCreator } from 'zustand/vanilla';

export type IThemeSlice = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

export const createThemeSlice: StateCreator<IThemeSlice> = set => ({
  isDarkMode: false,
  toggleTheme: (): void => {
    set(state => ({ isDarkMode: !state.isDarkMode }));
  },
});
