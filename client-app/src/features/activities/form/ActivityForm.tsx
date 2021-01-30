import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Grid, Segment } from "semantic-ui-react";
import { IActivityFormValues } from "../../../app/models/activity";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";
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
  const {
    submitting,
    activity: initialFormState,
    loadActivity,
    loadingIndicator,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivityFormValues>({
    id: undefined,
    title: "",
    description: "",
    date: undefined,
    time: undefined,
    city: "",
    category: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }
    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    initialFormState,
    activity.id,
  ]);

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

  if (loadingIndicator) return <LoadingComponent content="Loading data..." />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            onSubmit={handleSubmitFinalForm}
            render={({ handleSubmit }) => {
              return (
                <Form onSubmit={handleSubmit}>
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
                    floated="right"
                    positive
                    type="submit"
                    content="Submit"
                  />
                  <Button
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
