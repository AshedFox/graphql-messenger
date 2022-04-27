import {makeAutoObservable} from "mobx";
import {ModalStatus} from "../components/shared/Modal";
import {createContext, useContext} from "react";

class ChatUsersModalStore {
    status: ModalStatus = ModalStatus.Closed;

    constructor() {
        makeAutoObservable(this);
    }

    open = () => {
        if (this.status === ModalStatus.Closed) {
            this.status = ModalStatus.Open;
        }
    }
    startClosing = () => {
        if (this.status === ModalStatus.Open) {
            this.status = ModalStatus.Closing;
        }
    }
    endClosing = () => {
        if (this.status === ModalStatus.Closing) {
            this.status = ModalStatus.Closed;
        }
    }
}

export const chatUsersModalStore = new ChatUsersModalStore();

const context = createContext(chatUsersModalStore);
export const useChatUsersModalStore = () => useContext(context);
