import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { ActivityFormValues } from "../../../app/models/activity";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import { TextInput } from "../../../app/common/form/TextInput";
import { TextAreaInput } from "../../../app/common/form/TextAreaInput";
import { SelectInput } from "../../../app/common/form/SelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import { DateInput } from "../../../app/common/form/DateInput";
import { combineDateAndTime } from "../../../app/common/util/util";

interface DetailsParams {
  id: string;
}

export const ActivityForm: React.FC<RouteComponentProps<DetailsParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const { submitting, loadActivity } = activityStore;

  const [activity, setActivity] = useState(new ActivityFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id)
        .then((activity) => setActivity(new ActivityFormValues(activity)))
        .finally(() => setLoading(false));
    }
  }, [loadActivity, match.params.id, setLoading]);

  // const handleSubmit = () => {
  //   if (activity.id.length === 0) {
  //     let newActivity = {
  //       ...activity,
  //       id: uuid(),
  //     };
  //     createActivity(newActivity).then(() =>
  //       history.push(`/activities/${newActivity.id}`)
  //     );
  //   } else {
  //     editActivity(activity).then(() =>
  //       history.push(`/activities/${activity.id}`)
  //     );
  //   }
  // };

  const handleSubmitFinalForm = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time);
    const { date, time, ...activity } = values;
    activity.date = dateAndTime;
    console.log(activity);
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            initialValues={activity}
            onSubmit={handleSubmitFinalForm}
            render={({ handleSubmit }) => {
              return (
                <Form onSubmit={handleSubmit} loading={loading}>
                  <Field
                    name="title"
                    placeholder="Title"
                    value={activity.title}
                    component={TextInput}
                  />
                  <Field
                    rows={3}
                    name="description"
                    placeholder="Description"
                    value={activity.description}
                    component={TextAreaInput}
                  />
                  <Field
                    name="category"
                    placeholder="Category"
                    value={activity.category}
                    component={SelectInput}
                    options={categoryOptions}
                  />
                  <Form.Group widths="equal">
                    <Field
                      name="date"
                      placeholder="Date"
                      date={true}
                      value={activity.date}
                      component={DateInput}
                    />
                    <Field
                      name="time"
                      placeholder="Time"
                      time={true}
                      value={activity.date}
                      component={DateInput}
                    />
                  </Form.Group>
                  <Field
                    name="city"
                    placeholder="City"
                    value={activity.city}
                    component={TextInput}
                  />
                  <Field
                    name="venue"
                    placeholder="Venue"
                    value={activity.venue}
                    component={TextInput}
                  />
                  <Button
                    loading={submitting}
                    disabled={loading}
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                  />
                  <Button
                    disabled={loading}
                    floated="right"
                    type="button"
                    content="Cancel"
                    onClick={() => history.push("/activities")}
                  />
                </Form>
              );
            }}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
