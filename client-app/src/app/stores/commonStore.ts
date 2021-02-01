import { RootStore } from "./rootStore";
import { makeAutoObservable, reaction } from "mobx";

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          localStorage.setItem("jwt", token);
        } else {
          localStorage.removeItem("jwt");
        }
      }
    );
  }

  //observables
  token: string | null = localStorage.getItem("jwt");
  appLoaded = false;

  //actions
  setToken = (token: string | null) => {
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
