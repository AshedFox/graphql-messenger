import {createContext, useContext} from "react";
import {ClosableStore} from "./types/ClosableStore";

export const invitesModalStore = new ClosableStore();
const context = createContext(invitesModalStore);
export const useInvitesModalStore = () => useContext(context);
