import { makeAutoObservable, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { Activities } from "../api/agent";
import { IActivity } from "../models/activity";

class ActivityStore {
  constructor() {
    makeAutoObservable(this);
  }
  //observables
  activityRegistry = new Map();
  activity: IActivity | null = null;
  loadingIndicator = false;
  submitting = false;
  target = "";

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
          activity.date = new Date(activity.date);
          return this.activityRegistry.set(activity.id, activity);
        });
        this.loadingIndicator = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingIndicator = false;
      });
      console.log(error);
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
          activity.date = new Date(activity.date);
          this.activity = activity;
          this.loadingIndicator = false;
        });
        return activity;
      } catch (error) {
        runInAction(() => {
          this.loadingIndicator = false;
        });
        console.log(error);
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
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      console.log(error);
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
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      console.log(error);
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
      console.log(error);
    }
  };
}

export default createContext(new ActivityStore());
