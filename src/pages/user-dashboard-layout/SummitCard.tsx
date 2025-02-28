import React from 'react';
import Grid from '@mui/material/Grid2';

interface SummitCardProps {
  date?: string;
  title?: string;
  location?: string;
  url?: string;
}

const SummitCard: React.FC<SummitCardProps> = ({
  date,
  title,
  location,
  url
}) => {
  return (
    <Grid className="summit-card">
      <Grid className="date-tag">
        <span>Date: {date}</span>
      </Grid>
      
      <h2 className="summit-title">{title}</h2>
      
      <Grid className="summit-details">
        { location &&(
          <Grid container className="location-row" alignItems="flex-start" wrap="nowrap">
          <Grid className="label-container">
            <span className="label">Location:</span>
          </Grid>
          <Grid  className="value-container">
            <span className="value">{location}</span>
          </Grid>
        </Grid>
        )}
        {url &&(
        <Grid container className="location-row" alignItems="flex-start" wrap="nowrap">
        <Grid className="label-container">
          <span className="label">Url:</span>
        </Grid>
        <Grid className="value-container">
          <span className="value">{url}</span>
        </Grid>
      </Grid>
        )}
        <Grid className="status-row">
          <span className="label">Status:</span>
          <span className="status-badge">Registered</span>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SummitCard;