import { Autocomplete, TextField, InputAdornment, IconButton, CircularProgress, Typography } from '@mui/material';
import {  Clear } from '@mui/icons-material';
import Search from '../../assets/svg/Search.svg'
import { Controller } from "react-hook-form";
import { useState, useEffect } from "react";

interface ICustomAutocompleteProps<T> {
  name: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  control?: any;
  rules?: any;
  style?: React.CSSProperties;
  className?: string;
  onSearch: (query: string) => void; // Prop for handling API search
  loading: boolean; // Prop to indicate if data is loading
  clearable?: boolean; // Prop to make the input clearable
  onCustomButtonClick?: () => void;
  customButtonLabel?:string
  onTextChange?:any
  defaultValue?:any
}

/**
 * Autocomplete search component
 * @author Neethu
 */
const CustomAutocomplete = <T,>({
  name,
  options,
  getOptionLabel,
  placeholder : placeholder,
  control,
  rules,
  onSearch,
  loading,
  clearable = true,  // Default to true, so the clear button is enabled by default
  onChange,
  onCustomButtonClick,
  customButtonLabel,
  onTextChange,
  defaultValue,
  ...props
}: ICustomAutocompleteProps<T> & { onChange?: (value: T | null) => void }) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (inputValue.length >= 3) {
      onSearch(inputValue);
    }
    else if(inputValue.length === 0){
      onSearch('');
      setInputValue('');
    }
  }, [inputValue]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...props}
          disableClearable
          sx={{
            "& .MuiAutocomplete-popupIndicator": {
             display: "none", // Hides the dropdown arrow
            },
          }}
          options={options}
          getOptionLabel={getOptionLabel}
          value={field.value ||defaultValue|| null}
          onChange={(_, data) => {
            field.onChange(data);
            if (onChange) {
              onChange(data); // Call the onChange prop
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            if (newInputValue === "") {
              // Clear field value when the input is manually cleared
              field.onChange(null);
              if (onChange) {   onChange(" " as T); }
            
            }
            if(onTextChange){
             onTextChange(newInputValue);
            }
            setInputValue(newInputValue)
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              className={`custom-autopopulate ${props.className}`}
              error={!!error}
              helperText={error ? error.message : null}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <IconButton className="custom-autocomplete-icon">
                        <Search />
                      </IconButton>
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {/* Render the clear icon if the field is clearable */}
                    {clearable && field.value && (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={() => {
                            field.onChange(" " as T );; // Clear the value when clicked
                             if (onChange) {   onChange(" " as T); } // Call the onChange callback with empty string
                          }}
                          size="small"
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    )}
                      {/* Render the custom button if `onCustomButtonClick` is provided */}
                      {onCustomButtonClick && !field.value && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            onCustomButtonClick(); // Trigger the custom button action
                          }}
                          size="small"
                        >
                          <IconButton> {/* Add your custom icon or button here */}
                          <Typography variant='button'>{customButtonLabel}</Typography> 
                          </IconButton>
                        </IconButton>
                      </InputAdornment>
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      )}
    />
  );
};
export default CustomAutocomplete;
