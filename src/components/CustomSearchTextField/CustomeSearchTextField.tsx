import {
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
  } from '@mui/material';
  import { Search } from '@mui/icons-material';
  import { Controller } from "react-hook-form";
  
  interface ICustomSearchTextFieldProps<T> {
    name: string;
    placeholder?: string;
    control: any;
    rules?: any;
    style?: React.CSSProperties;
    className?: string;
  }
  
  const CustomSearchTextField = <T,>({
    name,
    placeholder = "Search...",
    control,
    rules,
    ...props
  }: ICustomSearchTextFieldProps<T>) => {
    return (
      <FormControl fullWidth  style={props.style}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <OutlinedInput
                {...field}
                className={props.className}
                placeholder={placeholder}
                startAdornment={
                  <InputAdornment position="start">
                    <IconButton className='custom-search-text-field-icon'>
                      <Search/>
                    </IconButton>
                  </InputAdornment>
                }
                error={!!error}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none', // Removes the border
                    },
                  }}
              />
              {error && (
                <span className="error-text">{error.message}</span>
              )}
            </>
          )}
        />
      </FormControl>
    );
  };
  
  export default CustomSearchTextField;
  