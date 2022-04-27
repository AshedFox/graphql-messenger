import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";

class ChatDropdownStore {
    isOpen: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    switchIsOpen = () => {
        this.isOpen = !this.isOpen;
    }
    setIsOpen = (isOpen: boolean) => {
        this.isOpen = isOpen;
    }
}

export const chatDropdownStore = new ChatDropdownStore();

const context = createContext(chatDropdownStore);
export const useChatDropdownStore = () => useContext(context);
