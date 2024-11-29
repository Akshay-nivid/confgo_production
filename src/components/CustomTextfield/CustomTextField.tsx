import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
  Tooltip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Example icon, replace with your preferred icon
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";
import { useState } from "react";
import clsx from "clsx";
import InfoIcon from '@mui/icons-material/Info';

interface ICustomTextFieldProps<T extends FieldValues> {
  prefixIconButton?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  suffixIconButton?: React.ReactNode;
  suffixIconSecondButton?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  handleToggleprefixIcon?: () => void;
  handleToggleSuffixIcon?: () => void;
  handleToggleSuffixSecondIcon?: () => void;
  min?: string | number;
  max?: string | number;
  type?: string;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  control?: Control<T>;
  style?: React.CSSProperties;
  showHeader?: boolean;
  requiredField?: boolean;
  defaultValue?: PathValue<T, Path<T>>;
  value?: PathValue<T, Path<T>>;
  className?: string;
  formControlClassName?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  size?: "small" | "medium" | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  onBlur?: React.ChangeEventHandler<HTMLInputElement>;
  minDate?:string;
  maxDate?:string;
  onClick?: React.ChangeEventHandler<HTMLInputElement>;
  isNumeric?:boolean;
  info?: any;
  infoContent?: any
}

interface InputPropsType {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  min?: string | number;
  max?: string | number;
}

/*
 * component used to render textfield
 */
const CustomTextField = <T extends FieldValues>({
  name,
  type,
  label,
  placeholder,
  control,
  rules,
  showHeader = false,
  requiredField = false,
  defaultValue,
  value,
  size = "medium",
  onChange,
  multiline = false,
  disabled = false,
  rows,
  readOnly = false,
  onBlur,
  onClick,
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
          {props.suffixIconSecondButton && <IconButton onClick={props.handleToggleSuffixSecondIcon}>
            {props.suffixIconSecondButton}
          </IconButton>
            
          }
        </InputAdornment>
      );
    }

    if (type === "password") {
      propsObj.endAdornment = (
        <InputAdornment position="end">
          <IconButton
            className={`custom-text-field-icon-btn`}
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
    if(type==="date"){
      if(props.minDate){
        propsObj.min = props.minDate; 
      }
      if(props.maxDate){
        propsObj.max=props.maxDate
      }
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

    if (props.info) {
      propsObj.endAdornment = (
        <InputAdornment position="end"><Tooltip title={props.infoContent}>
          <IconButton edge="end">
            <InfoIcon />
          </IconButton>
        </Tooltip></InputAdornment>
      )
    }

    return propsObj;
  };

  /**
   * Method handles the on blur event
   * @param event : on blur event parameter
   */
  const handleBlur = (event: any) => {
    onBlur && onBlur(event);
  };

  /**
   * Method handles the on click event
   * @param event : on click event parameter
   */
  const handleOnClick = (event: any) => {
    onClick && onClick(event);
  };

  

  return (
    <FormControl
      fullWidth
      className={clsx("custom-text-field", props.formControlClassName)}
    >
      {showHeader && (
        <Typography className="label-header" variant="h6">
          {placeholder}
          {requiredField && <span className="error-text">*</span>}
        </Typography>
      )}

      <InputLabel htmlFor={name} className="custom-input-label">
         {label? label:placeholder}
     </InputLabel>

      <Controller
        name={name}
        defaultValue={defaultValue}
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
                size={size}
                error={!!error?.message}
                id={name}
                type={type === "password" ? passwordType : type}
                label={label}
                multiline={multiline}
                rows={rows || 1}
                readOnly={readOnly}
                placeholder={type === "date" ? "" : placeholder}
                className={clsx(error ? "error-input" : "", props.className)}
                onBlur={handleBlur}
                onClick={handleOnClick}
                inputProps={inputProps()}
                {...inputProps()}
                onChange={(e) => {
                  const numericValue = (props.isNumeric)? e.target.value.replace(/[^0-9]/g, ""):e.target.value;
                  field.onChange(numericValue); 
                }}
                
              />
              {error?.message && (
                <FormHelperText className="error-text">
                  {error.message}
                </FormHelperText>
              )}
            </>
          );
        }}
      />
    </FormControl>
  );
};

export default CustomTextField;

