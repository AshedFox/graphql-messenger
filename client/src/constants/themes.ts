import Theme from "../types/Theme";

const lightTheme: Theme = {
    primaryBg: "#FCFCFC",
    secondaryBg: "#232323",
    uiPrimaryBg: "#F4F4F4",
    uiPrimaryHoverBg: "#f6d2d2",
    uiPrimaryFocusBg: "#f7c7c7",
    uiSecondaryBg: "#FCFCFC",
    uiSecondaryHoverBg: "#4f3737",
    uiSecondaryFocusBg: "#4f3737",
    primaryText: "#121212",
    secondaryText: "#fcfcfc",
    optionalText: "#5A5A5A",
}

const darkTheme: Theme = {
    primaryBg: "#0C0C0C",
    secondaryBg: "#1C1C1C",
    uiPrimaryBg: "#1C1C1C",
    uiPrimaryHoverBg: "#332626",
    uiPrimaryFocusBg: "#493131",
    uiSecondaryBg: "#2A2A2A",
    uiSecondaryHoverBg: "#332626",
    uiSecondaryFocusBg: "#493131",
    primaryText: "#868686",
    secondaryText: "#9B9B9B",
    optionalText: "#515151",
}

const themes = {
    "light": lightTheme,
    "dark": darkTheme
}

export default themes;
