/**
 * DescriptionComponent
 * component to display a description with a custom class prefix for styling.
 * Props:
 * - `description` (string): The description text to display.
 * - `classPrefix` (string): The CSS class prefix for styling.
 */
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
