import useStore from "@/Libs/store";
import { Typography, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection, Accept } from "react-dropzone";
import DeleteIcon from "@mui/icons-material/Close";
import CustomButton from "../CustomButton/CustomButton";
import { Logger } from "@/Utils/Logger";
import clsx from "clsx";

interface Resolution {
 width: number | null;
 height: number | null;
}

interface FileUploadProps {
 allowDrop?: boolean;
 acceptedFiles?: string[];
 canSelectMultiple?: boolean;
 maxSize?: number;
 resolution?: Resolution;
 onSubmit?: (response: any) => void;
 trimClientSide?: boolean;
 width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * FileUpload component allows users to upload files with the ability to resize images before uploading.
 * It supports drag-and-drop functionality, file previews, and rejection messages.
 * @param {FileUploadProps} props
 */
const FileUpload: React.FC<FileUploadProps> = ({
 allowDrop = true,
 acceptedFiles = ["image/jpeg", "image/png"],
 canSelectMultiple = false,
 maxSize = 1 * 1024 * 1024,
 resolution = { width: null, height: null },
 onSubmit,
 trimClientSide = true,
 width = "30rem",
  height = "30rem",
 className
}) => {
 const [previewUrls, setPreviewUrls] = useState<string[]>([]);
 const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
 const [rejectionMessages, setRejectionMessages] = useState<string[]>([]); // State to store rejection messages
 const setDataById = useStore((state: any) => state.setDataById);
 const POST = useStore((state: any) => state.POST);

 /**
  * Trims the image to the specified resolution.
  * @param file - The image file to be trimmed.
  * @returns  The resized image file or null if there was an error.
  */
 const trimImageResolution = (file: File): Promise<File | null> => {
  return new Promise((resolve, reject) => {
   const img = new Image();
   img.src = URL.createObjectURL(file);

   img.onload = () => {
    const canvas = document.createElement("canvas");
    const targetWidth = resolution.width || img.width;
    const targetHeight = resolution.height || img.height;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
     ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
     canvas.toBlob((blob) => {
      if (blob) {
       resolve(new File([blob], file.name, { type: file.type }));
      } else {
       reject(new Error("Error creating resized image"));
      }
     }, file.type);
    } else {
     reject(new Error("Canvas context error"));
    }
   };

   img.onerror = () => reject(new Error("Unable to load image"));
  });
 };

 /**
  * Handles file drop event and processes the dropped files.
  * @param  acceptedFiles - The files that were accepted.
  * @param  fileRejections - The files that were rejected.
  */
 const onDrop = useCallback(
  async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
   if (!allowDrop) return;

   const validFiles: File[] = [];
   const trimmedStatus: boolean[] = [];
   const rejectionMsgs: string[] = []; // Array to store rejection messages

   // Process accepted files, resizing if necessary
   await Promise.all(
    acceptedFiles.map(async (file) => {
     if (trimClientSide && resolution.width && resolution.height) {
      try {
       const trimmedFile = await trimImageResolution(file);
       if (trimmedFile) {
        validFiles.push(trimmedFile);
        trimmedStatus.push(true);
       }
      } catch {
       trimmedStatus.push(false);
      }
     } else {
      validFiles.push(file);
      trimmedStatus.push(false);
     }
    })
   );

   // Process rejected files and store rejection messages
   fileRejections.forEach(({ file, errors }) => {
    const errorMessages = errors.map((e) => {
     // Check if error is related to file size
     if (e.code === "file-too-large") {
      // Convert the maxSize to MB for the message
      const maxSizeInMB = (maxSize / (1024 * 1024)).toFixed(2); // Convert to MB with 2 decimal points
      return `File "${file.name}" exceeds the maximum size of ${maxSizeInMB} MB`;
     }
     return e.message;
    });
    rejectionMsgs.push(errorMessages.join(", "));
   });

   setPreviewUrls(validFiles.map((file) => URL.createObjectURL(file)));
   setSelectedFiles(validFiles);
   setRejectionMessages(rejectionMsgs); // Set rejection messages
  },
  [allowDrop, resolution, trimClientSide]
 );

 const accept: Accept =
  acceptedFiles.length > 0
   ? Object.fromEntries(acceptedFiles.map((type) => [type, []]))
   : {};

 const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept,
  multiple: canSelectMultiple,
  maxSize,
 });

 /**
  * Handles the form submission to upload the selected files.
  */
 const handleSubmit = async () => {
  const formData = new FormData();
  selectedFiles.forEach((file) => formData.append("file", file));

  await POST({
   url: "/asset",
   body: formData,
   id: "assetUpload",
   successCB: (response: any) => {
    setSelectedFiles([]);
    setPreviewUrls([]);
    setDataById("snackBarInfo", {
     open: true,
     autoHideDuration: 2000,
     severity: "success",
     message: "File uploaded successfully!",
    });
    onSubmit && onSubmit(response?.data);
   },
   errorCB: (error: any) => {
    setDataById("snackBarInfo", {
     open: true,
     autoHideDuration: 2000,
     severity: "error",
     message: error.message,
    });
    Logger.error("Upload error", error);
   },
  });
 };

 /**
  * Removes a file from the selected files list.
  * @param index - The index of the file to be removed.
  */
 const handleRemoveFile = (index: number) => {
  setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
 };

 return (
  <Grid
   className={clsx("file-upload", className)}
   container
   style={{ width, height }}
   justifyContent={"flex-end"}
  >
   <Grid {...getRootProps()} className="file-upload-dropzone" size={{ xs: 12 }}>
    <input {...getInputProps()} />
    {selectedFiles.length === 0 && (
     <Grid>
      {isDragActive ? (
       <Typography>Drop the files here...</Typography>
      ) : (
       <Typography>Drag & drop files here, or click to select files</Typography>
      )}
     </Grid>
    )}

    {/* File previews with remove button and upload progress */}
    <Grid className="file-upload-preview" justifyContent={"center"}>
     {previewUrls.map((url, index) => (
      <Grid key={index} className="file-upload-preview-item">
       <img src={url} alt={`preview ${index}`} />
       {/* Display the file name */}

       <IconButton
        onClick={(event) => {
         event.stopPropagation(); // Prevent file manager from opening
         handleRemoveFile(index); // Your existing function to remove the file
        }}
       >
        <DeleteIcon />
       </IconButton>
       <Typography
        className="file-upload-preview-item-name"
        variant="body2"
        align="center"
        title={selectedFiles[index]?.name}
       >
        {selectedFiles[index]?.name}
       </Typography>
      </Grid>
     ))}
    </Grid>
    {/* Display rejection messages */}
    {rejectionMessages.length > 0 && (
     <Grid>
      {rejectionMessages.map((message, index) => (
       <Typography key={index} className="file-upload-rejection-messages">
        {message}
       </Typography>
      ))}
     </Grid>
    )}
   </Grid>

   {/* Show submit button only if files are selected */}
   {selectedFiles.length > 0 && (
    <Grid>
     <CustomButton
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      label="Upload"
      className="file-upload-button"
     />
    </Grid>
   )}
  </Grid>
 );
};

export default FileUpload;
