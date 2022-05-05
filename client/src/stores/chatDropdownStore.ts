import {createContext, useContext} from "react";
import {ClosableStore} from "./types/ClosableStore";


export const chatDropdownStore = new ClosableStore();
const context = createContext(chatDropdownStore);
export const useChatDropdownStore = () => useContext(context);
