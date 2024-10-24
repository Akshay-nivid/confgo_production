import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
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
  rules?: RegisterOptions<T>; 
    variant?: 'outlined' | 'filled' | 'standard';
    size?:"small" | "medium" | undefined;
    disabled?:boolean;
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
  disabled=false
}: CustomSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} fullWidth variant={variant}>
              <Select
              size={size}
                  {...field}
                  className='custom-text-field'
            value={field.value}
            onChange={field.onChange}
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