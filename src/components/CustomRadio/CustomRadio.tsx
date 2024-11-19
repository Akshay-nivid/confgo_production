/**
 * CustomRadio component handles the customization of the radio group
 */
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    FormControl,
  } from "@mui/material";
  import { Control, Controller, FieldValues, Path, PathValue } from "react-hook-form";
  
  interface ICustomRadio<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    options: { label: string; value: string | number }[];
    labelPlacement?: "end" | "start" | "top" | "bottom";
    required?: boolean;
    disabled?: boolean;
    row?: boolean; // For horizontal layout of radio buttons
    value?: PathValue<T, Path<T>>; // The default value passed as a prop
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  /*
   * Custom radio button component
   */
  const CustomRadio = <T extends FieldValues>({
    control,
    name,
    label,
    options,
    labelPlacement,
    row,
    value,
    className,
    onChange,
    ...props
  }: ICustomRadio<T>) => {
    return (
      <FormControl component="fieldset">
        {label && <FormLabel component="legend">{label}</FormLabel>}
        <Controller
          control={control}
          name={name}
          defaultValue={value}
          render={({ field }) => (
            <RadioGroup
            className={className}
              row={row} // For horizontal alignment of radios
              {...field}
              onChange={(e) => {
                field.onChange(e);
                if (onChange) {
                  onChange(e);
                }
              }}
            >
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio color="primary" {...props} />}
                  label={option.label}
                  labelPlacement={labelPlacement ? labelPlacement : "end"}
                />
              ))}
            </RadioGroup>
          )}
        />
      </FormControl>
    );
  };
  
  export default CustomRadio;
  