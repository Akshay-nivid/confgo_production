import { FormControl, TextField, FormHelperText, Typography } from "@mui/material";
import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
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
  value?:any;
  disabled?:boolean;
  className?: string;
  formControlClassName?: string;
  min?:any;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
  value,
  min,
  onChange,
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
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <TextField
                {...field}
                {...props}
                name={name}
                value={value}
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
                onChange={onChange}
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