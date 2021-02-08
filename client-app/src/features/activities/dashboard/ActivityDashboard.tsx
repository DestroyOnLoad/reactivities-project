import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Grid, Loader } from "semantic-ui-react";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
import ActivityList from "./ActivityList";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InfiniteScroller from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";

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
        <InfiniteScroller
          pageStart={0}
          loadMore={handleGetNextPage}
          hasMore={!loadingNext && page + 1 < totalPages}
          initialLoad={false}
        >
          <ActivityList />
        </InfiniteScroller>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityDashboard);
