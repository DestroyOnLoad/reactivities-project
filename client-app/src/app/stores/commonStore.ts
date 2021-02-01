import { RootStore } from "./rootStore";
import { makeAutoObservable } from "mobx";

export default class CommonStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  //observables
  token: string | null = null;
  appLoaded = false;

  //actions
  setToken = (token: string | null) => {
    localStorage.setItem("jwt", token!);
    this.token = token;
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
