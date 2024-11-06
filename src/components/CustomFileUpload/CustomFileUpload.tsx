import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import delete icon for remove functionality
import clsx from "clsx";

interface ICustomFileUpload<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  defaultValue?: any;
  labelClassName?: string;
  className?: string;
  rules?: any;
}

const CustomFileUpload = <T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  multiple = false,
  defaultValue,
  labelClassName,
  className,
  rules,
}: ICustomFileUpload<T>) => {
  return (
    <FormControl component="fieldset">
      {label && (
        <FormLabel
          className={clsx("custom-file-upload-label mb-3", labelClassName)}
        >
          {label}
        </FormLabel>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const handleRemoveFile = (index: number) => {
            const newFiles = Array.isArray(value) ? [...value] : [];
            newFiles.splice(index, 1); // Remove file at the specified index
            onChange(newFiles);
          };

          return (
            <>
              <input
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    if (multiple) {
                      const newFiles = Array.from(files);
                      onChange([...(value || []), ...newFiles]); // Append new files
                    } else {
                      onChange(files[0]); // For single file, use the first file
                    }
                  }
                }}
                multiple={multiple}
                disabled={disabled}
                style={{ display: "none" }}
                id={`file-upload-${name}`}
              />
              <label htmlFor={`file-upload-${name}`}>
                <Button
                  variant="contained"
                  component="span"
                  disabled={disabled}
                  className={clsx("custom-file-upload", className)}
                >
                  {multiple ? "Upload Files" : "Upload File"}
                </Button>
              </label>

              {value && (
                <Box
                  className="flex flex-col gap-y-5 "
                  style={{ marginTop: "10px" }}
                >
                  {multiple ? (
                    (value as File[]).map((file, idx) => (
                      <Box
                        className="px-4 rounded border border-gray-300 justify-between"
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <p style={{ marginRight: "10px" }}>{file.name}</p>
                        <IconButton
                          onClick={() => handleRemoveFile(idx)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))
                  ) : (
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <Typography style={{ marginRight: "10px" }}>
                        {(value as File)?.name}
                      </Typography>
                      <IconButton
                        onClick={() => onChange(undefined)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              )}

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

export default CustomFileUpload;
