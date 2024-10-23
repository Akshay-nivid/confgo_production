import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { Controller, Control } from "react-hook-form";

interface CustomCheckboxProps {
  name: string;
  label: string;
  control: Control<any>;
  defaultValue?: boolean;
  rules?: object;
  labelPlacement?: "end" | "start" | "top" | "bottom";
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  label,
  control,
  defaultValue = false,
  labelPlacement,
  rules = {},
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <FormControlLabel
            labelPlacement={labelPlacement ? labelPlacement : "end"}
            control={
              <Checkbox
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                className="custom-checkbox"
              />
            }
            label={<span className={"checkbox-label"}>{label}</span>}
          />
          {error && <span style={{ color: "red" }}>{error.message}</span>}
        </>
      )}
    />
  );
};

export default CustomCheckbox;

