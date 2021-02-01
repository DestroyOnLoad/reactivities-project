import { makeAutoObservable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  //observables
  modal = {
    open: false,
    body: null,
  };

  //actions
  openModal = (content: any): void => {
    this.modal.open = true;
    this.modal.body = content;
  };

  closeModal = (): void => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
