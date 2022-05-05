import {createContext, useContext} from "react";
import {ClosableStore} from "./types/ClosableStore";


export const createChatModalStore = new ClosableStore();
const context = createContext(createChatModalStore);
export const useCreateChatModalStore = () => useContext(context);
