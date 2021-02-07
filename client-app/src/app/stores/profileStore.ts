import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { Profiles } from "../api/agent";
import { IPhoto, IProfile } from "../models/profile";
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
  uploadingPhoto = false;
  loading = false;

  //computed
  get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

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
      toast.error("Problem loading profile");
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = [...this.profile.photos, photo];
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
      toast.error("Problem uploading photo");
    }
  };

  setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await Profiles.setMain(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find((x) => x.isMain)!.isMain = false;
        this.profile!.photos.find((x) => x.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem setting main photo.");
    }
  };

  deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await Profiles.delete(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          (x) => x.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem deleting photo.");
    }
  };

  followUser = async (username: string) => {
    this.loading = true;
    try {
      await Profiles.follow(username);
      runInAction(() => {
        this.profile!.isFollowing = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem attempting to follow user.");
    }
  };

  unfollowUser = async (username: string) => {
    this.loading = true;
    try {
      await Profiles.unfollow(username);
      runInAction(() => {
        this.profile!.isFollowing = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem attempting to unfollow user.");
    }
  };
}
