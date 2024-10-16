import { Autocomplete, TextField, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Controller } from "react-hook-form";
import { useState, useEffect } from "react";

interface ICustomAutocompleteProps<T> {
  name: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  control: any;
  rules?: any;
  style?: React.CSSProperties;
  className?: string;
  onSearch: (query: string) => void; // Prop for handling API search
  loading: boolean; // Prop to indicate if data is loading
}

/**
 * Autocomplete search component
 * @author Neethu
 */
const CustomAutocomplete = <T,>({
  name,
  options,
  getOptionLabel,
  placeholder = "Search Coupon Name",
  control,
  rules,
  onSearch,
  loading,
  onChange, 
  ...props
}: ICustomAutocompleteProps<T> & { onChange?: (value: T | null) => void }) => {
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (inputValue.length >= 3) {
      onSearch(inputValue);
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
          options={options}
          getOptionLabel={getOptionLabel}
          value={field.value || null}
          onChange={(_, data) => {
            field.onChange(data);
            if (onChange) {
              onChange(data); // Call the onChange prop
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
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
