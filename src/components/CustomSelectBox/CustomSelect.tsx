import { FormControl, Select, MenuItem, FormHelperText, InputLabel } from '@mui/material';
import clsx from 'clsx';
import { Controller, Control, FieldValues, Path, RegisterOptions, PathValue } from 'react-hook-form';

interface CustomSelectProps<T extends FieldValues> {
  name: Path<T>; 
  label: string;
  options: { value: string | number; label: string }[];
  control: Control<T>;
  defaultValue?:  PathValue<T, Path<T>> | undefined;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  rules?: RegisterOptions<T>; 
    variant?: 'outlined' | 'filled' | 'standard';
    size?:"small" | "medium" | undefined;
    disabled?:boolean;
    optionClick?: (index: number | string) => void;
    onChange?:any
}

const CustomSelect = <T extends FieldValues>({
  name,
  label,
    options,
  size,
  control,
  defaultValue ,
  variant = 'outlined',
  rules,
  disabled = false,
  optionClick,
  className,
}: CustomSelectProps<T>) => {

    /**
     * Method handles on select clicks
     * @param fieldValue : field value select
     */
    const handleOnclick = (fieldValue: string | number) => {
        if (optionClick) {
            optionClick(fieldValue)
        }
        return fieldValue; 
    }

  return (
    <Controller
      name={name}
      
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth variant={variant}>
          <InputLabel id={`${name}-label`} className="select-input-label">{label}</InputLabel>
              <Select
              size={size}
                  {...field}
                  className={clsx('custom-text-field',className)}
            value={field.value ? field.value :  (defaultValue || '')}
            onChange={(event) => field.onChange(handleOnclick(event.target.value))}
            labelId={`${name}-label`}
            placeholder={label}
            displayEmpty
            disabled={disabled}
          >
            <MenuItem value="" disabled>
              {label}
            </MenuItem>
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && (
            <FormHelperText className="error-text">{error.message}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default CustomSelect;