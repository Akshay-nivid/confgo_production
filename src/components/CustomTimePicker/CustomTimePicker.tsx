import React, { useState, useMemo, useEffect } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Control, Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import { FormControl, FormHelperText } from "@mui/material";

/**
 * CustomTimePicker Component
 * 
 * A reusable custom time picker component built with MUI's TimePicker and react-hook-form integration.
 * It allows selecting time in either 12-hour (AM/PM) or 24-hour format based on the `ampm` prop.
 * 
 * Props:
 * - `className` (string, optional): CSS class for custom styling of the TimePicker.
 * - `ampm` (boolean, optional): Determines the time format. `true` for 12-hour (default), `false` for 24-hour.
 * - `name` (string, required): Unique name for the time picker, useful in form handling.
 * - `label` (string, required): Label displayed above the TimePicker.
 * - `placeholder` (string, required): Placeholder text for the TimePicker.
 * - `control` (Control<any>, required): Control object from react-hook-form for form state management.
 * - `type` (string, required): Type of the input (e.g., "time").
 * 
 * Features:
 * - Uses MUI's `TimePicker` for a consistent design.
 * - Supports 12-hour or 24-hour format via the `ampm` prop.
 * - Optimized rendering using `useMemo` to improve performance.
 * - State management with React's `useState` for tracking the selected time value.
 * 
 * Example Usage:
 * <CustomTimePicker
 *   label="Select Time"
 *   className="custom-class"
 *   ampm={false} // 24-hour format
 *   name="startTime"
 *   placeholder="HH:mm"
 *   control={control}
 *   type="time"
 * />
 * 
 * Note: Ensure to wrap this component inside a react-hook-form context if using `control`.
 */

interface BasicTimePickerProps {
  className?: string;
  ampm?: boolean;
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  type: string;
  defaultValue?:string;
  onValueChange?: (hasChanged: boolean, value: string | null) => void; // Callback to inform about changes

}

const CustomTimePicker: React.FC<BasicTimePickerProps> = React.memo(({ 
  control,
  name,
  label, 
  className, 
  ampm = true ,
  defaultValue,
  onValueChange,
}) => {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (defaultValue) {
      const format = ampm ? "hh:mm A" : "HH:mm"; // Use appropriate format
      const parsedTime = dayjs(defaultValue, format); // Parse with format
      setValue(parsedTime.isValid() ? parsedTime : null); // Ensure validity
    }
  }, [defaultValue, ampm]);

  //Checking the default value changed or not
  const handleChange = (newValue: Dayjs | null) => {
    const formattedTime = newValue?.format("HH:mm") || null; // Format the time or set null
    setValue(newValue);

    // Notify parent about the change
    if (onValueChange) {
      onValueChange(formattedTime !== defaultValue, formattedTime);
    }
  };

  const memoizedTimePicker = useMemo(
    () => (
      <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
      <FormControl error={!!error} fullWidth>
        <TimePicker
        {...field}
          label={label} 
          onChange={(newValue: Dayjs | null) =>{
            const formattedTime = newValue?.format("HH:mm"); 
            field.onChange(formattedTime)
            handleChange(newValue); 
             setValue(newValue)}}
             value={value}
          ampm={ampm}
          className="custom-Time-picker"
        />
        {error && (
          <FormHelperText className="error-text">{error.message}</FormHelperText>
        )}
      </FormControl>
      }

    />
    ),
    [value, className, ampm, label]
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {memoizedTimePicker}
    </LocalizationProvider>
  );
});

export default CustomTimePicker;
