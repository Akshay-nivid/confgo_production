import React from 'react';
import Grid from "@mui/material/Grid2";
import {Typography } from '@mui/material';
import UploadedIcon from '../../../assets/svg/DocumentIcon.svg'; // Replace with your actual UploadedIcon

// Props for the UploadedFile component
interface UserUploadedFileCardProps {
  uploadedFile: {
    id: string;
    name: string;
  } | null;
  title:string;
}

const UserUploadedFileCard: React.FC<UserUploadedFileCardProps> = ({ uploadedFile, title}) => {
  if (!uploadedFile?.id) return null;

  return (
    <Grid className="uploaded-container" direction="column">

      {/* Uploaded File Details */}
      <Grid container direction="row" alignItems="center">
        <UploadedIcon />
        </Grid>
        <Grid>
        <Typography className="uploaded-container-text">
          {title}
        </Typography>
      </Grid>

      {/* File Name and Download */}
      <Grid>
        <Typography
          className="uploaded-container-name"
        //   onClick={() => onDownload(uploadedFile.id)}
        >
          {`${uploadedFile.name}`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UserUploadedFileCard;
