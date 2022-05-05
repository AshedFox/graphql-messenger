import {createContext, useContext} from "react";
import {ClosableStore} from "./types/ClosableStore";


export const chatUsersModalStore = new ClosableStore();
const context = createContext(chatUsersModalStore);
export const useChatUsersModalStore = () => useContext(context);
