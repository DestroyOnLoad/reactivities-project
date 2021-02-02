import { makeAutoObservable, runInAction } from "mobx";
import { SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { history } from "../..";
import { Activities } from "../api/agent";
import { createAttendee, setActivityProps } from "../common/util/util";
import { IActivity } from "../models/activity";
import { RootStore } from "./rootStore";

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootstore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootstore;
  }
  //observables
  activityRegistry = new Map();
  activity: IActivity | null = null;
  loadingIndicator = false;
  submitting = false;
  target = "";
  loading = false;

  //computed
  get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  //actions
  loadActivities = async () => {
    this.loadingIndicator = true;
    try {
      const activities = await Activities.list();
      runInAction(() => {
        activities.map<void>((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          return this.activityRegistry.set(activity.id, activity);
        });
        this.loadingIndicator = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingIndicator = false;
      });
      throw error;
    }
  };

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity !== undefined) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingIndicator = true;
      try {
        activity = await Activities.details(id);
        runInAction(() => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingIndicator = false;
        });
        return activity;
      } catch (error) {
        runInAction(() => {
          this.loadingIndicator = false;
        });
        throw error;
      }
    }
  };

  clearActivity = () => {
    this.activity = null;
  };

  getActivity = (id: string): IActivity => {
    return this.activityRegistry.get(id);
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem submitting data.");
      throw error;
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      throw error;
    }
  };

  deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    activity: IActivity
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await Activities.delete(activity.id);
      runInAction(() => {
        this.activityRegistry.delete(activity.id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });
      throw error;
    }
  };

  attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = [...this.activity.attendees, attendee];
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem joining activity! Please try again soon!");
    }
  };

  cancelAttendance = async () => {
    this.loading = true;
    try {
      await Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
        }
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem cancelling attendance! Try again soon!");
    }
  };
}
