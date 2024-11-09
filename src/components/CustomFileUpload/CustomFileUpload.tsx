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
/**
 * component to upload files
 */
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
                  display={"flex"}
                  flexDirection={"column"}
                  rowGap={1.5}
                  mt={1.5}
                >
                  {multiple ? (
                    (value as File[]).map((file, index) => (
                      <Box
                        className="  file-item"
                        borderRadius={2}
                        paddingBlock={2}
                        key={index}
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        <Typography mr={1.5} className="file-name-text">{file.name}</Typography>
                        <IconButton
                          onClick={() => handleRemoveFile(index)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))
                  ) : (
                    <Box display={"flex"} alignItems={"center"}>
                      <Typography mr={1.5}>
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
