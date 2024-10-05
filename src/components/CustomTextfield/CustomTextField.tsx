import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Example icon, replace with your preferred icon
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { useState } from "react";

interface ICustomTextFieldProps<T extends FieldValues> {
  prefixIconButton?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIconButton?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  handleToggleprefixIcon?: () => void;
  handleToggleSuffixIcon?: () => void;
  // isShowPassword?: boolean;
  min?: number;
  max?: number;
  type?: string;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  control?: Control<T>;
  style?: React.CSSProperties;
  showHeader?:boolean
  requiredField?:boolean
  
}

interface InputPropsType {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  min?: number;
  max?: number;
}
/*
 * re-usable custom Textfield component
 */
const CustomTextField = <T extends FieldValues>({
  name,
  type,
  label,
  placeholder,
  control,
  rules,
  showHeader=false,
  requiredField=false,
  
  ...props
}: ICustomTextFieldProps<T>) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  /*
   * A function hide and show password text
   */
  const handleTogglePassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  /**
   * A fucntion which returns an object named propsObj which contains InputPropsType values by checking whether specific props are present or not.
   */
  const inputProps = () => {
    const propsObj: InputPropsType = {};

    if (props.prefixIconButton) {
      propsObj.startAdornment = (
        <InputAdornment position="start">
          <IconButton
            className="custom-text-field-icon-btn"
            onClick={props.handleToggleprefixIcon}
          >
            {props.prefixIconButton}
          </IconButton>
        </InputAdornment>
      );
    }

    if (props.prefixIcon) {
      propsObj.startAdornment = (
        <InputAdornment position="start">{props.prefixIcon}</InputAdornment>
      );
    }

    if (props.suffixIconButton) {
      propsObj.endAdornment = (
        <InputAdornment position="end">
          <IconButton onClick={props.handleToggleSuffixIcon}>
            {props.suffixIconButton}
          </IconButton>
        </InputAdornment>
      );
    }

    if (type === "password") {
      propsObj.endAdornment = (
        <InputAdornment position="end">
          <IconButton
            className="custom-text-field-icon-btn"
            onClick={
              type === "password"
                ? handleTogglePassword
                : props.handleToggleSuffixIcon
            }
          >
            {isShowPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      );
    }

    if (props.suffixIcon) {
      propsObj.endAdornment = (
        <InputAdornment position="end">{props.suffixIcon}</InputAdornment>
      );
    }

    if (props.min) {
      propsObj.min = props.min;
    }

    if (props.max) {
      propsObj.max = props.max;
    }
    return propsObj;
  };

  return (
    <>
      <FormControl fullWidth className="custom-text-field">
      {showHeader&&<Typography className="label-header" variant="h6">{placeholder}{requiredField&&<span className="error-text">*</span>}</Typography>}  
        {label ? <InputLabel htmlFor={name}>{label}</InputLabel> : <></>}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => {
            const passwordType = isShowPassword ? "text" : "password";
            return (
              <>
                <OutlinedInput
                  autoComplete="false"
                  {...field}
                  {...props}
                  name={name}
                  error={error?.message ? true : false}
                  id={name}
                  // helperText={error ? error[name]?.message:''}
                  type={type === "password" ? passwordType : type}
                  label={label}
                  className="custom-text-field"
                  placeholder={placeholder}
                  required
                  {...inputProps()}
                />
                {error?.message && (
                  <FormHelperText className="helper-text">
                    {error.message}
                  </FormHelperText>
                )}
              </>
            );
          }}
        />
      </FormControl>
    </>
  );
};

export default CustomTextField;
