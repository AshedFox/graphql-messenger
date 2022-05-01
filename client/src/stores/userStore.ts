import {makeAutoObservable} from "mobx";
import {createContext, useContext} from "react";
import {UserModel} from "../types/models";

class UserStore {
    me?: UserModel;

    constructor() {
        makeAutoObservable(this);
    }

    setMe = (user?: UserModel) => {
        this.me = user;
    }
    reset = () => {
        this.me = undefined;
    }
}

export const userStore = new UserStore();

const context = createContext(userStore);
export const useUserStore = () => useContext(context);
