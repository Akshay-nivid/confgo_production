import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Example icon, replace with your preferred icon
import {
  Control,
  Controller,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";
import { EventHandler, useState } from "react";
import { clsx } from 'clsx';

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
  showHeader?:boolean;
  requiredField?:boolean;
  defaultValue?:PathValue<T, Path<T>>;
  value?:PathValue<T, Path<T>>;
  className?: string;
  formControlClassName?: string;
  multiline?:boolean;
  rows?: number;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

interface InputPropsType {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  min?: number;
  max?: number;
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
  onChange,
  multiline=false,
  disabled= false,
  rows,
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

    if (type === 'password') {
      propsObj.endAdornment = (
        <InputAdornment position="end">
          <IconButton
            className={`custom-text-field-icon-btn`}
            onClick={
              type === 'password'
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
        {showHeader && <Typography className="label-header" variant="h6">{placeholder}{requiredField && <span className="error-text">*</span>}</Typography>}
        {<InputLabel htmlFor={name}  className='custom-text-field-placeholder'>{placeholder}</InputLabel> }
        <Controller
          name={name}
          defaultValue={defaultValue}
          control={control}
          disabled={disabled}
          rules={rules}
          render={({ field, fieldState: { error } }) => {
            const passwordType = isShowPassword ? 'text' : 'password';
            return (
              <>
                <OutlinedInput
                  autoComplete="false"
                  {...field}
                  {...props}
                  name={name}
                  error={error?.message ? true : false}
                  id={name}
                  multiline={multiline}
                  rows={rows}
                //  onChange={onChange}
                  type={type === 'password' ? passwordType : type}
                  label={label}
                  className={clsx(
                    error
                      ? 'custom-text-field error-input'
                      : 'custom-text-field',
                    props.className
                  )}
                  placeholder={type === "date" ? "" : placeholder} 
                  {...inputProps()}
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
    </>
  );
};

export default CustomTextField;
