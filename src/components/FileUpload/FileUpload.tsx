import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { CloudUpload, Delete, CheckCircle } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import apiClient from "@/Libs/Https/API-client";
import { useForm } from "react-hook-form";
import CustomButton from "../CustomButton/CustomButton";
import CustomTextField from "../CustomTextfield/CustomTextField";
import Grid from "@mui/material/Grid2";
import "./_style.scss";
interface FileUploadProps {
  maxFileSizeMB?: number;
  allowedFileTypes?: string[];
  onUploadSuccess?: (file: CustomFile) => void; // Callback prop for successful upload
}

interface FileError {
  message: string;
}

interface CustomFile {
  id: number;
  name: string;
  mimeType: string;
  sourcePath: string;
  size: number;
  createdOn: string;
}

const Input = styled("input")({
  display: "none",
});

const FileUpload: React.FC<FileUploadProps> = ({
  maxFileSizeMB = 5,
  allowedFileTypes = [],
  onUploadSuccess, // Destructure new prop
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<FileError | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const { control, handleSubmit: handleFormSubmit, setValue } = useForm({
    defaultValues: {
      fileName: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const selectedFile = uploadedFiles[0];
    const isFileTypeValid =
      allowedFileTypes.length === 0 || allowedFileTypes.includes(selectedFile.type);
    const isFileSizeValid = selectedFile.size <= maxFileSizeMB * 1024 * 1024;

    if (!isFileTypeValid) {
      setError({
        message: `Invalid file type. Only ${allowedFileTypes.join(", ")} are allowed.`,
      });
      setSnackbarOpen(true);
      return;
    }

    if (!isFileSizeValid) {
      setError({
        message: `File size exceeds the maximum allowed size of ${maxFileSizeMB} MB.`,
      });
      setSnackbarOpen(true);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadSuccess(false);
  };

  const handleFileRemove = () => {
    setFile(null);
    setValue("fileName", ""); // Clear the file name input
    setUploadSuccess(false);
  };

  const handleSubmit = async (data: { fileName: string }) => {
    if (!file) {
      setError({ message: "No file selected. Please upload a file." });
      setSnackbarOpen(true);
      return;
    }

    if (!data.fileName.trim()) {
      setError({ message: "Please enter a name for the image." });
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", data.fileName);

    try {
      const response = await apiClient.post("/asset", formData);

      if (response.status !== 201) {
        throw new Error("Upload failed");
      }

      const uploadedFileData = response.data.response.data as CustomFile;
      setFile(null);
      setValue("fileName", "");
      setUploadSuccess(true);

      // Call the onUploadSuccess prop with uploaded file data
      if (onUploadSuccess) {
        onUploadSuccess(uploadedFileData);
      }
    } catch (error) {
      setError({ message: "Upload failed. Please try again." });
      setSnackbarOpen(true);
    }
  };

  return (
    <Box className="file-upload">
      <Typography variant="h6" gutterBottom>
        Upload your File
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{xs:12}}>
          <label htmlFor="file-upload-button">
            <Input
              id="file-upload-button"
              type="file"
              onChange={handleFileUpload}
              accept={allowedFileTypes.length > 0 ? allowedFileTypes.join(",") : undefined}
              className="file-upload__input"
            />
            <CustomButton
              label="Select File"
              startIcon={<CloudUpload />}
              variant="contained"
              color="primary"
              onClick={() => document.getElementById("file-upload-button")?.click()}
              className="file-upload__select-button"
            />
          </label>
        </Grid>

        {file && (
          <Grid size={{xs:12}} className="file-upload__file-info">
            <Typography variant="body2" className="file-upload__file-name">
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </Typography>
            <Tooltip title="Remove File">
              <IconButton
                aria-label="delete"
                color="secondary"
                onClick={handleFileRemove}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Grid>
        )}

        <Grid size={{xs:12}}>
          <CustomTextField
            name="fileName"
            label="Enter a name for the file"
            placeholder="Enter a name for the file"
            control={control}
            rules={{ required: "File name is required" }}
            multiline={false}
            className="file-upload__text-field"
          />
        </Grid>

        <Grid size={{xs:12}}>
          <CustomButton
            label="Submit"
            variant="contained"
            color="secondary"
            onClick={handleFormSubmit(handleSubmit)}
            className="file-upload__submit-button"
          />

          {uploadSuccess && (
            <Box mt={2} display="flex" alignItems="center" className="file-upload__success-message">
              <CheckCircle />
              <Typography variant="body2" ml={1}>
                File uploaded successfully!
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        className="file-upload__snackbar"
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {error?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUpload;
