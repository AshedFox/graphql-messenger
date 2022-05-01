import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {Status} from "../types/Status";

export class FunctionsSideBarStore {
    status: Status = Status.Closed;

    constructor() {
        makeAutoObservable(this);
    }

    reset = () => {
        this.status = Status.Closed;
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

export const functionsSideBarStore = new FunctionsSideBarStore();

const context = createContext(functionsSideBarStore);
export const useFunctionsSideBarStore = () => useContext(context);
