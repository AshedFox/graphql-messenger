import {makeAutoObservable} from "mobx";
import {SideBarStatus} from "../components/shared/SideBar";
import {createContext, useContext} from "react";

export class FunctionsSideBarStore {
    status: SideBarStatus = SideBarStatus.Closed;

    constructor() {
        makeAutoObservable(this);
    }

    reset = () => {
        this.status = SideBarStatus.Closed;
    }
    open = () => {
        if (this.status === SideBarStatus.Closed) {
            this.status = SideBarStatus.Open;
        }
    }
    startClosing = () => {
        if (this.status === SideBarStatus.Open) {
            this.status = SideBarStatus.Closing;
        }
    }
    endClosing = () => {
        if (this.status === SideBarStatus.Closing) {
            this.status = SideBarStatus.Closed;
        }
    }
}

export const functionsSideBarStore = new FunctionsSideBarStore();

const context = createContext(functionsSideBarStore);
export const useFunctionsSideBarStore = () => useContext(context);
