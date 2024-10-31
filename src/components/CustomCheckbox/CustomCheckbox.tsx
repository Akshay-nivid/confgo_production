import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface ICustomCheckbox<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  options: { label: string; value: string | number, checked?: boolean }[]; // Array of checkbox options
  labelPlacement?: "end" | "start" | "top" | "bottom";
  required?: boolean;
  disabled?: boolean;
  row?: boolean; // For horizontal layout of checkboxes
  defaultValue?: any;
}

const CustomCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
  options,
  labelPlacement,
  row,
  defaultValue,
  ...props
}: ICustomCheckbox<T>) => {
  return (
    <FormControl component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <FormGroup row={row}>
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          render={({ field }) => (
            <>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={
                        Array.isArray(field.value) &&
                        field.value.includes(option.value)
                      } // Ensure value is treated as an array
                      onChange={(e) => {
                        const checkedValue = e.target.checked;
                        let newValue: (string | number)[] = [
                          ...(field.value || []),
                        ]; // Explicitly typing newValue

                        if (checkedValue) {
                          // Add value to array if checked
                          newValue.push(option.value);
                        } else {
                          // Remove value from array if unchecked
                          newValue = newValue.filter((v) => v !== option.value);
                        }

                        field.onChange(newValue); // Update the array in the form
                      }}
                      color="primary"
                      {...props}
                    />
                  }
                  label={option.label}
                  labelPlacement={labelPlacement ? labelPlacement : "end"}
                />
              ))}
            </>
          )}
        />
      </FormGroup>
    </FormControl>
  );
};

export default CustomCheckbox;
