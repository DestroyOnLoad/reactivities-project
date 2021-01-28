import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";

export const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const {
    activitiesByDate: activities,
    deleteActivity,
    submitting,
    target,
  } = activityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map((activity) => {
          return (
            <Item key={activity.id}>
              <Item.Content>
                <Item.Header as="a">{activity.title}</Item.Header>
                <Item.Meta>{activity.date}</Item.Meta>
                <Item.Description>
                  <div>{activity.description}</div>
                  <div>
                    {activity.city}, {activity.venue}
                  </div>
                </Item.Description>
                <Item.Extra>
                  <Label basic content={`${activity.category}`} />
                  <Button
                    floated="right"
                    content="View"
                    color="blue"
                    as={Link}
                    to={`/activities/${activity.id}`}
                  />
                  <Button
                    name={activity.id}
                    loading={target === activity.id && submitting}
                    floated="right"
                    content="Delete"
                    color="red"
                    onClick={(e) => deleteActivity(e, activity)}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Segment>
  );
};

export default observer(ActivityList);
