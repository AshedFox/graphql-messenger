import {makeAutoObservable} from "mobx";
import {ModalStatus} from "../components/shared/Modal";
import {createContext, useContext} from "react";

class CreateChatModalStore {
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

export const createChatModalStore = new CreateChatModalStore();

const context = createContext(createChatModalStore);
export const useCreateChatModalStore = () => useContext(context);
