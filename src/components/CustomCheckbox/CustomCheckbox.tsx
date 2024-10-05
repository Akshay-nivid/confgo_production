import { Checkbox, FormControlLabel } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface ICheckbox<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  required?: boolean;
  disabled?: boolean;
  value?: boolean;
}

/*
 * custom checkbox  component
 */

const CustomCheckbox = <T extends FieldValues>({
  control,
  name,
  label,
  labelPlacement,
  ...props
}: ICheckbox<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormControlLabel
            labelPlacement={labelPlacement ? labelPlacement : "end"}
            label={<span className={"checkbox-label"}>{label}</span>}
            control={
              <Checkbox
                color="primary"
                className="custom-checkbox"
                {...field}
                {...props}
              />
            }
          />
        );
      }}
    />
  );
};

export default CustomCheckbox;
