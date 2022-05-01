import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {Status} from "../types/Status";

class ChatDropdownStore {
    status: Status = Status.Closed;

    constructor() {
        makeAutoObservable(this);
    }

    open = () => {
        if (this.status === Status.Closed) {
            this.status = Status.Open;
        }
    }
    startClosing = () => {
        if (this.status === Status.Open) {
            this.status = Status.Closing;
        }
    }
    endClosing = () => {
        if (this.status === Status.Closing) {
            this.status = Status.Closed;
        }
    }

    reset = () => {
        this.status = Status.Closed;
    }
}

export const chatDropdownStore = new ChatDropdownStore();

const context = createContext(chatDropdownStore);
export const useChatDropdownStore = () => useContext(context);
