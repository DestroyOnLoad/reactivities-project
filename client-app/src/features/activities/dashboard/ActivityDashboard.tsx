import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityList from "./ActivityList";
import { RootStoreContext } from "../../../app/stores/rootStore";

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivities,
    loadingIndicator,
    setPage,
    page,
    totalPages,
  } = rootStore.activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNextPage = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadActivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  if (loadingIndicator && page === 0)
    return (
      <LoadingComponent content={"Loading activities..."}></LoadingComponent>
    );

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
        <Button
          positive
          floated="right"
          content="More..."
          onClick={handleGetNextPage}
          loading={loadingNext}
          disabled={totalPages === page + 1}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        <h1>Activity filters</h1>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
