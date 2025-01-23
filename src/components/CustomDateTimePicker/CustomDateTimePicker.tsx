import React, { useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"; // Import AdapterMoment
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Control, Controller } from "react-hook-form";
import moment, { Moment } from "moment"; // Use moment
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Tooltip,
  InputAdornment,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface CustomDateTimePickerProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  rules?: any;
  defaultValue?: string; // ISO string or Moment-parsable string
  format?: string; // E.g., "YYYY-MM-DD HH:mm"
  onChange?: (value: string | null) => void;
  infoContent?: string; // Tooltip content
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  control,
  name,
  label,
  placeholder,
  rules,
  defaultValue,
  format = "YYYY-MM-DD HH:mm", // Ensure format is "YYYY-MM-DD HH:mm"
  onChange,
  infoContent,
}) => {
  const [value, setValue] = useState<Moment | null>(
    defaultValue ? moment(defaultValue) : null
  );

  useEffect(() => {
    if (defaultValue) {
      const parsedValue = moment(defaultValue);
      setValue(parsedValue.isValid() ? parsedValue : null);
    }
  }, [defaultValue]);

  const handleChange = (newValue: Moment | null) => {
    setValue(newValue);
    if (onChange) {
      const formattedValue = newValue?.format(format) || null;
      onChange(formattedValue);
    }
  };

  return (
    <FormControl fullWidth>
      {label && <InputLabel shrink>{label}</InputLabel>}
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          defaultValue={defaultValue}
          render={({ field, fieldState: { error } }) => (
            <>
              <DateTimePicker
                {...field}
                value={value}
                onChange={(newValue) => {
                  handleChange(newValue);
                  field.onChange(newValue?.toISOString() || null);
                }}
                renderInput={(params) => (
                  <div style={{ position: "relative" }}>
                    <params.TextField
                      {...params.inputProps}
                      error={!!error?.message}
                      placeholder={placeholder}
                      fullWidth
                    />
                    {infoContent && (
                      <InputAdornment position="end">
                        <Tooltip title={infoContent}>
                          <IconButton edge="end">
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    )}
                  </div>
                )}
              />
              {error?.message && (
                <FormHelperText error>{error.message}</FormHelperText>
              )}
            </>
          )}
        />
      </LocalizationProvider>
    </FormControl>
  );
};

export default CustomDateTimePicker;
