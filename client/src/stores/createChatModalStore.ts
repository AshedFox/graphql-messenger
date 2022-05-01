import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {Status} from "../types/Status";

class CreateChatModalStore {
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

export const createChatModalStore = new CreateChatModalStore();

const context = createContext(createChatModalStore);
export const useCreateChatModalStore = () => useContext(context);
