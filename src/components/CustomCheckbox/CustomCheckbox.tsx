import React, { useEffect } from "react";
import { FormGroup, Checkbox, FormControlLabel } from "@mui/material";
import { UseFormRegisterReturn } from "react-hook-form";
import { Controller, ControllerProps, UseFormSetValue } from "react-hook-form";

/**
 * Component used to display checkbox
 */

type TFieldValues = Record<string, string>;

interface FxCheckEditProps extends Partial<ControllerProps> {
  id: string;
  name: string;
  onChange?: (event: any, name?: any) => void;
  className?: string;
  data: any;
  disabled?: boolean;
  row?: "vertical" | "horizontal";
  setValue?: UseFormSetValue<TFieldValues>;
  register?: UseFormRegisterReturn;
  label?: string;
  updateOptions?: boolean;
  value?: any;
}

/*
 * Component Function for Checkbox component
 * @param  {FxCheckEditProps} props with accepted values
 */
const CustomCheckbox: React.FC<FxCheckEditProps> = (props) => {
  /**
   * Method returns the selected checkbox items during the react hook form onchange event
   * @param e : React hook form onchange event parameter
   * @param value : React hook form field value
   * @returns : Selected checkbox items
   */
  const handleCheckedItems = (e: any, value: any) => {
    let defArray: any = value ? (Array.isArray(value) ? value : [value]) : [];
    if (e.target.checked) {
      defArray?.push(e.target.value);
    } else {
      let indexToRemove = defArray?.indexOf(e.target.value);
      if (indexToRemove !== -1) {
        defArray?.splice(indexToRemove, 1);
      }
    }
    return defArray;
  };

  /**
   * Method sets the value of the checkbox based on the checked parameter
   */
  const { data, name, setValue } = props;

  useEffect(() => {
    const checkedValues = data
      ?.filter((item: any) => item.checked)
      ?.map((item: any) => item.value);
    if (checkedValues?.length > 0) {
      setValue && setValue(name, checkedValues);
    }
  }, [data, name, setValue]);

  return (
    <div>
      <Controller
        name={props.name}
        control={props.control}
        rules={props.rules ? props.rules : { required: false }}
        defaultValue={props.value ? props.value : props.defaultValue}
        render={({ field: { onChange, value } }) => {
          return (
            <FormGroup
              row={props.row === "vertical" ? false : true}
              className={
                props.className ? props.className : "fx-group-checkbox"
              }
            >
              {props.data?.map((option: any, i: number) => {
                return (
                  <FormControlLabel
                    name={props.name}
                    id={"check-label-" + props.id}
                    control={
                      <Checkbox
                        onChange={(e) => {
                          onChange(handleCheckedItems(e, value));
                          props.onChange?.(e);
                        }}
                        id={props.id + "-" + option.value}
                        value={option.value}
                      />
                    }
                    label={option.label}
                    checked={
                      findItemInArray(value, option.value) || option.checked
                    }
                    disabled={
                      props.disabled
                        ? props.disabled
                        : option.disabled
                        ? option.disabled
                        : false
                    }
                  />
                );
              })}
            </FormGroup>
          );
        }}
      />
    </div>
  );
};
export default CustomCheckbox;

export const findItemInArray = (data: any, value: any) => {
  return (
    data &&
    Array.isArray(data) &&
    data?.find((subItem: any) => subItem === value) !== undefined
  );
};
