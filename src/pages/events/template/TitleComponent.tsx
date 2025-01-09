import React from 'react';
import { Typography } from '@mui/material';

interface TitleComponentProps {
  title: string;
  classPrefix: string;
}

const TitleComponent: React.FC<TitleComponentProps> = ({ title, classPrefix }) => (
  <Typography className={`${classPrefix}`}>
    {title}
  </Typography>
);

export default TitleComponent;
