import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityList from "./ActivityList";
import ActivityStore from "../../../app/stores/activityStore";

export const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingIndicator)
    return (
      <LoadingComponent content={"Loading activities..."}></LoadingComponent>
    );

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h1>Activity filters</h1>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
