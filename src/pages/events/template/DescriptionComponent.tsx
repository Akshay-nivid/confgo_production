import React from 'react';
import { Typography } from '@mui/material';

interface DescriptionComponentProps {
  description: string;
  classPrefix: string;
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({ description, classPrefix }) => (
  <Typography className={`${classPrefix}`}>
    {description}
  </Typography>
);

export default DescriptionComponent;
