import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {Status} from "../types/Status";

class ChatUsersModalStore {
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
}

export const chatUsersModalStore = new ChatUsersModalStore();

const context = createContext(chatUsersModalStore);
export const useChatUsersModalStore = () => useContext(context);
