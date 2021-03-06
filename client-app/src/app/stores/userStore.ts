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

  getUser = async () => {
    try {
      const user = await User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      throw error;
    }
  };

  //actions
  login = async (values: IUserFormValues) => {
    try {
      const user = await User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };

  register = async (values: IUserFormValues) => {
    try {
      const user = await User.register(values);
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };
}
