import React from "react";
import { FieldRenderProps } from "react-final-form";
import { DateTimePicker } from "react-widgets";
import { Form, FormFieldProps, Label } from "semantic-ui-react";

interface IProps extends FieldRenderProps<Date>, FormFieldProps {}

export const DateInput: React.FC<IProps> = ({
  input,
  width,
  date = false,
  time = false,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <DateTimePicker
        date={date}
        time={time}
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        messages={{ dateButton: undefined, timeButton: undefined }}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
