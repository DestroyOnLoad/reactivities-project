import { makeAutoObservable, runInAction } from "mobx";
import { Profiles } from "../api/agent";
import { IProfile } from "../models/profile";
import { RootStore } from "./rootStore";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  //observables
  profile: IProfile | null = null;
  loadingProfile = false;

  //actions
  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      throw error;
    }
  };
}
