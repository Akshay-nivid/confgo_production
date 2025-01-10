/**
 * TitleComponent
 * component to display a title with a custom class prefix for styling.
 * Props:
 * - `title` (string): The title text to display.
 * - `classPrefix` (string): The CSS class prefix for styling.
 */
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
