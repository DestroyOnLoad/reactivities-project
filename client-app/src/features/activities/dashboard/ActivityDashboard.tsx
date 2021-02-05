import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityList from "./ActivityList";
import { RootStoreContext } from "../../../app/stores/rootStore";

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { loadActivities, loadingIndicator } = rootStore.activityStore;

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingIndicator)
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
