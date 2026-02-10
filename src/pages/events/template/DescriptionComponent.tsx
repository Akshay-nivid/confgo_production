/**
 * DescriptionComponent
 * component to display a description with a custom class prefix for styling.
 * Props:
 * - `description` (string): The description text to display.
 * - `classPrefix` (string): The CSS class prefix for styling.
 */
import React from 'react';
import { Typography } from '@mui/material';
import { truncateString } from '@/Utils/CommonBaseClass';

interface DescriptionComponentProps {
  description: string;
  classPrefix: string;
  temp?:string;
}

const DescriptionComponent: React.FC<DescriptionComponentProps> = ({ description, classPrefix,temp}) => (
  <Typography className={`${classPrefix}`}>
  {temp ? truncateString(description, 90) : description}
</Typography>
);

export default DescriptionComponent;
