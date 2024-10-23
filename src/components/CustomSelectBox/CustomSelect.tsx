import React from 'react';
import { FormControl, Select, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';
import { Controller } from 'react-hook-form';

interface CustomSelectProps {
    name: string;
    label: string;
    options: { value: string | number; label: string }[];
    control: any; // This can be more specific if you're using TypeScript
    defaultValue?: string | number;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    rules?: any;

}
/*
 * component used to render dropdownlist
*/
const CustomSelect: React.FC<CustomSelectProps> = ({
    name,
    label,
    options,
    control,
    defaultValue = '',
    rules,
    error = false,
    helperText,
    fullWidth = false,
    disabled=false,
 
}) => {
    return (
        <FormControl className="custom-text-field" variant="outlined" error={error} fullWidth={fullWidth}>
            {/* <InputLabel id={`${name}-label`}>{label}</InputLabel> */}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <Select
                        {...field}
                        labelId={`${name}-label`}
                        // label={label}
                        placeholder={label}
                        className={error ? 'error-input placeholder': 'placeholder'}
                        displayEmpty
                        disabled={disabled}
                    >
                        <MenuItem value=""  className='placeholder' disabled>
                            {label} 
                        </MenuItem>
                        {options.map((option) => (
                            <MenuItem  key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default CustomSelect;
