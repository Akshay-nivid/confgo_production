import useStore from '@/Libs/store';
import { Typography, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection, Accept } from 'react-dropzone';
import DeleteIcon from '@mui/icons-material/Close';
import CustomButton from '../CustomButton/CustomButton';
import clsx from 'clsx';
import DownloadIcon from '../../assets/svg/abstract-download.svg';
import { PdfIcon } from '@/assets/svg';

interface Resolution {
  width?: number | null;
}

interface FileUploadProps {
  allowDrop?: boolean;
  acceptedFiles?: string[];
  canSelectMultiple?: boolean;
  maxSize?: number;
  resolution?: Resolution;
  onSubmit?: (response: any) => void;
  trimClientSide?: boolean;
  onFileSelect?: (file: File[]) => void;
  width?: string | number;
  height?: string | number;
  className?: string;
  isAbstract?: boolean;
  disabled?: boolean;
  ratioLabel?: string;
}

/**
 * FileUpload component allows users to upload files with the ability to resize images before uploading.
 * It supports drag-and-drop functionality, file previews, and rejection messages.
 * @param {FileUploadProps} props
 */
const FileUpload: React.FC<FileUploadProps> = ({
  allowDrop = true,
  acceptedFiles = ['image/jpeg', 'image/png'],
  canSelectMultiple = false,
  maxSize = 1,
  resolution = { width: null },
  onSubmit,
  trimClientSide = true,
  onFileSelect,
  // width = '30rem',
  // height = '30rem',
  className,
  isAbstract,
  disabled = false,
  ratioLabel = "16:9",
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [rejectionMessages, setRejectionMessages] = useState<string[]>([]); // State to store rejection messages
  const setDataById = useStore((state: any) => state.setDataById);
  const POST = useStore((state: any) => state.POST);

  const assetUploadLoading = useStore((state: any) => state.compData?.['assetUpload']?.['asset']?.loading);
  const maxSizeInBytes = maxSize * 1024 * 1024;

  // const loading = useStore((state: any) => state.compData?.['assetUpload']?.['asset']?.loading);

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
        const aspectRatio = img.width / img.height;
        let targetWidth = img.width;
        let targetHeight = img.height;
        if (resolution.width) {
          // If width is provided, calculate height based on aspect ratio
          targetWidth = resolution.width;
          targetHeight = resolution.width / aspectRatio;
        }
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          canvas.toBlob(blob => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error('Error creating resized image'));
            }
          }, file.type);
        } else {
          reject(new Error('Canvas context error'));
        }
      };

      img.onerror = () => reject(new Error('Unable to load image'));
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
          if (trimClientSide && resolution.width) {
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
        const errorMessages = errors.map(e => {
          // Check if error is related to file size
          if (e.code === 'file-too-large') {
            return `File "${file.name}" exceeds the maximum size of ${maxSize} MB`;
          }
          return e.message;
        });
        rejectionMsgs.push(errorMessages.join(', '));
      });

      setPreviewUrls(validFiles.map(file => URL.createObjectURL(file)));
      setSelectedFiles(validFiles);
      onFileSelect && onFileSelect(validFiles)
      setRejectionMessages(rejectionMsgs); // Set rejection messages
    },
    [allowDrop, resolution, trimClientSide]
  );

  const accept: Accept = acceptedFiles.length > 0 ? Object.fromEntries(acceptedFiles.map(type => [type, []])) : {};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: canSelectMultiple,
    maxSize: maxSizeInBytes,
  });

  /**
   * Handles the form submission to upload the selected files.
   */
  const handleSubmit = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('file', file));

    await POST({
      url: 'asset',
      body: formData,
      id: 'assetUpload',
      successCB: (response: any) => {
        setSelectedFiles([]);
        setPreviewUrls([]);
        setDataById('snackBarInfo', {
          open: true,
          autoHideDuration: 2000,
          severity: 'success',
          message: 'File uploaded successfully!',
        });
        if (onSubmit) {
          if (canSelectMultiple) {
            onSubmit(response?.data);
          } else {
            onSubmit(Array.isArray(response?.data) ? response.data?.[0] : response?.data);
          }
        }
      },
      errorCB: (error: any) => {
        setDataById('snackBarInfo', {
          open: true,
          autoHideDuration: 2000,
          severity: 'error',
          message: error.message,
        });
      },
    });
  };

  /**
   * Removes a file from the selected files list.
   * @param index - The index of the file to be removed.
   */
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };
  const isPDF = (file: File) => file.type === 'application/pdf';

  return (
    <Grid className={clsx('file-upload', className)} container 
    // style={{ width, height }} 
    justifyContent={'flex-end'}>
      <Grid {...getRootProps()} className={isAbstract ? 'file-upload-dropzone file-upload-abstract-dropzone' : 'file-upload-dropzone'} size={{ xs: 12 }}>
        <input {...getInputProps()} disabled={disabled} />
        {selectedFiles.length === 0 && (
          <Grid>
            {isDragActive ? (
              <Typography>Drop the files here...</Typography>
            ) : isAbstract ? (
              <Grid container className="file-upload-abstract" direction={'column'} justifyContent={'center'} alignItems={'center '}>
                <Grid>
                  <DownloadIcon />
                </Grid>
                <Grid>
                  <Typography className="file-upload-abstract-title">Attach Abstract</Typography>
                </Grid>
                <Grid>
                  <Typography className="file-upload-abstract-sub-title">Choose a file(PDF, DOCX), Max file size: {maxSize}MB</Typography>
                </Grid>
              </Grid>
            ) : (
              <>
              <Typography className="upload-dropzone-text">Drag & drop or click here to upload.</Typography>
              <Typography className="upload-dropzone-subtext">Choose a file to upload, Max file size: {maxSize}MB.</Typography>
              <Typography className="upload-dropzone-subtext">Recommended ratio: {ratioLabel} for best fit</Typography>
              </>
            )}
          </Grid>
        )}

        {/* File previews with remove button and upload progress */}
        <Grid className="file-upload-preview" justifyContent={'center'}>
          {previewUrls.map((url, index) => {
            const file = selectedFiles[index];
            const isFilePDF = isPDF(file);
            return (
              <Grid key={index} className="file-upload-preview-item">
                {isFilePDF ? (
                  <PdfIcon className='file-upload-preview-item-pdf'/> 
                ) : (
                  <img className="file-upload-preview-item-image" src={url} alt={`preview ${index}`} />
                )}

                <IconButton
                  onClick={event => {
                    event.stopPropagation();
                    handleRemoveFile(index); // Remove file
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <Typography className="file-upload-preview-item-name" variant="body2" align="center" title={file.name}>
                  {file.name}
                </Typography>
              </Grid>
            );
          })}
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
          <CustomButton variant="contained" color="primary" onClick={handleSubmit} disabled={assetUploadLoading} label="Upload" isLoading={assetUploadLoading} className="file-upload-button" />
        </Grid>
      )}
    </Grid>
  );
};

export default FileUpload;
