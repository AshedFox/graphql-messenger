import {Status} from "../../types/Status";
import {makeAutoObservable} from "mobx";

export class ClosableStore {
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
