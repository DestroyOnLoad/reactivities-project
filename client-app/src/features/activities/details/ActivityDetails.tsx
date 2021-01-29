import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityStore from "../../../app/stores/activityStore";
import { ActivityDetailedChat } from "./ActivityDetailedChat";
import { ActivityDetailedHeader } from "./ActivityDetailedHeader";
import { ActivityDetailedInfo } from "./ActivityDetailedInfo";
import { ActivityDetailedSidebar } from "./ActivityDetailedSidebar";

interface DetailParams {
  id: string;
}

export const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const { activity, loadActivity, loadingIndicator } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id, history]);

  if (loadingIndicator)
    return <LoadingComponent content="Loading activities..." />;

  if (!activity) return <h1>activity not found</h1>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailedHeader activity={activity} />
        <ActivityDetailedInfo activity={activity} />
        <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDetails);
