import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import { User } from "../api/agent";
import { IUser, IUserFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  //observables
  user: IUser | null = null;

  //computed
  get isLoggedIn() {
    return !!this.user;
  }

  //actions
  login = async (values: IUserFormValues) => {
    try {
      const user = await User.login(values);
      runInAction(() => {
        this.user = user;
      });
      console.log(user);
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };
}
