import { Switch, FormControlLabel, FormControl } from '@mui/material';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';

interface ICustomSwitch<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  required?: boolean;
  disabled?: boolean;
  value?: PathValue<T, Path<T>>;
  className?: string;
  onChange?: (checked: boolean) => void; 
  buttonColor?:"primary"|"success"|"error"|"info"|"warning"|"secondary"
}

/**
 * CustomSwitch component handles the customization of a MUI Switch with react-hook-form integration.
 */
const CustomSwitch = <T extends FieldValues>({
  control,
  name,
  label,
  labelPlacement = 'end', // default label placement
  value,
  className,
  onChange,
  buttonColor,
  ...props
}: ICustomSwitch<T>) => {
  return (
    <FormControl component="fieldset" className={className}>
      <Controller
        control={control}
        name={name}
        defaultValue={value}
        render={({ field }) => (
          <FormControlLabel
            label={label}
            labelPlacement={labelPlacement}
            control={
              <Switch
                {...field}
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e); 
                  onChange && onChange(e.target.checked); 
                }}
                color={buttonColor}
                // color="primary"
                {...props}
              />
            }
          />
        )}
      />
    </FormControl>
  );
};

export default CustomSwitch;
