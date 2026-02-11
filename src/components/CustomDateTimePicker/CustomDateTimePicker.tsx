import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"; // Import AdapterMoment
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Control, Controller } from "react-hook-form";
import moment, { Moment } from "moment"; // Use moment
import {
  FormControl,
  InputLabel,
} from "@mui/material";

interface CustomDateTimePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  rules?: any;
  defaultValue?: string; // ISO string or Moment-parsable string
  format?: string; // E.g., "YYYY-MM-DD HH:mm"
  onChange?: (value: string | null) => void;
  infoContent?: string; // Tooltip content
}

/**
 * Component for selecting  date and time
 * @param param0
 * @returns
 */
const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  control,
  name,
  label,
  placeholder,
  rules,
  defaultValue,
  format = "YYYY-MM-DD HH:mm",
  onChange,
}) => {
  const [value, setValue] = useState<Moment | null>(
    defaultValue ? moment(defaultValue) : null
  );

  useEffect(() => {
    if (defaultValue) {
      const parsedValue = moment(defaultValue);
      setValue(parsedValue.isValid() ? parsedValue : null);
    }
  }, [defaultValue]);
  //Function used to handle the changes
  const handleChange = (newValue: Moment | null) => {
    setValue(newValue);
    // if (onChange) {
    //   const formattedValue = newValue?.format(format) || null;
    //   onChange(formattedValue);
    // }
  };

  return (
    <FormControl fullWidth>
      {label && <InputLabel shrink>{label}</InputLabel>}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              value={field.value ? moment(field.value) : null}

              onChange={(newValue) => {
                handleChange(newValue);
                field.onChange(newValue ? newValue.toISOString() : null);

              }}
              minDateTime={moment()}
              slotProps={{
                textField: {
                  error: !!error?.message,
                  placeholder: placeholder,
                  fullWidth: true,
                  helperText: error?.message || "",
                },
              }}
            />
          )}
        />

      </LocalizationProvider>
    </FormControl>
  );
};

export default CustomDateTimePicker;
