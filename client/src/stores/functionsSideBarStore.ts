import {createContext, useContext} from "react";
import {ClosableStore} from "./types/ClosableStore";

export const functionsSideBarStore = new ClosableStore();
const context = createContext(functionsSideBarStore);
export const useFunctionsSideBarStore = () => useContext(context);
