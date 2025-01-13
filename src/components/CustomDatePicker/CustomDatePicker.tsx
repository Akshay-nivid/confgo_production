import { FormControl, TextField, FormHelperText, Typography } from "@mui/material";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import moment from "moment";
import { clsx } from "clsx";

interface ICustomDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  control?: Control<T>;
  style?: React.CSSProperties;
  showHeader?: boolean;
  requiredField?: boolean;
  defaultValue?: any;
  disabled?:boolean;
  className?: string;
  formControlClassName?: string;
  min?:any;
}
/**
 * Component used to render date picker for start and end date
 * @author Neethu
 */
const CustomDatePicker = <T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  rules,
  showHeader = false,
  requiredField = false,
  defaultValue,
  min,
  ...props
}: ICustomDatePickerProps<T>) => {
  return (
    <>
      <FormControl fullWidth className="custom-date-picker">
        {showHeader && (
          <Typography className="label-header" variant="h6">
            {placeholder}
            {requiredField && <span className="error-text">*</span>}
          </Typography>
        )}
        <Controller
          name={name}
          defaultValue={defaultValue}
          control={control}
          rules={{
              ...rules,
              validate: (value) => {
                  const selectedDate = new Date(value);
                  const minDate = new Date(min);
                  const maxDate = new Date(min).setFullYear(minDate.getFullYear() + 2);

                  if (selectedDate < minDate) {
                      return `Date must not be earlier than ${moment(min).format("DD-MM-YYYY")}`;
                  } else if (selectedDate > maxDate) {
                      return `Date must be within 2 years from ${moment(min).format("DD-MM-YYYY")}`;
                  }
              }
              }}
          render={({ field, fieldState: { error } }) => (
            <>
              <TextField
                {...field}
                {...props}
                name={name}
                type="date"
                label={label}
                error={!!error?.message}
                fullWidth
                InputLabelProps={{
                  shrink: true, // Ensures label doesn't overlap with the value
                }}
                inputProps={{
                  min: min, // Add min attribute for the input
                }}
                className={clsx(
                  error ? "custom-date-picker error-input" : "custom-date-picker",
                  props.className
                )}
              />
              {error?.message && (
                <FormHelperText className="error-text">
                  {error.message}
                </FormHelperText>
              )}
            </>
          )}
        />
      </FormControl>
    </>
  );
};

export default CustomDatePicker;