import {makeAutoObservable, reaction} from "mobx";
import themes from "../constants/themes";
import Theme from "../types/Theme";
import {createContext, useContext} from "react";

class ThemeStore {
    currentThemeName: keyof typeof themes;

    constructor() {
        makeAutoObservable(this);

        const existingTheme = localStorage.getItem('theme');

        if (existingTheme && Object.keys(themes).includes(existingTheme)) {
            this.currentThemeName = existingTheme as keyof typeof themes;
        } else {
            this.currentThemeName = 'light';
        }
    }

    get currentTheme(): Theme {
        return themes[this.currentThemeName];
    }

    setTheme = (theme: keyof typeof themes) => this.currentThemeName = theme;

    switchTheme = () => this.currentThemeName === 'light' ? this.setTheme('dark') : this.setTheme('light');
}

export const themeStore = new ThemeStore();

reaction<keyof typeof themes>(
    () => themeStore.currentThemeName,
    (theme) => localStorage.setItem('theme', theme)
)

const context = createContext(themeStore);
export const useThemeStore = () => useContext(context);
