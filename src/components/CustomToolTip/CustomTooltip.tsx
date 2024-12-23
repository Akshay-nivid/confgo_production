import React, { ReactNode } from 'react';
import Grid from '@mui/material/Grid2';
interface CustomTooltipProps {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}
/**
 * CustomTooltip
 * 
 * A reusable tooltip component that displays a title and optional children elements.
 * - Accepts `title` as the main content of the tooltip.
 * - Optionally wraps additional `children` components.
 * - Supports an optional `className` for custom styling.
 * 
 * Props:
 * - `title` (ReactNode): The content to be displayed in the tooltip.
 * - `children` (ReactNode, optional): Any child elements to be rendered inside the tooltip wrapper.
 * - `className` (string, optional): Additional class names for styling the wrapper.
 * 
 * Uses Material-UI's Grid for layout and supports memoization for optimization.
 */

const CustomTooltip: React.FC<CustomTooltipProps> = React.memo(({ title, children, className }) => {
  return (
    <Grid className={`custom-tooltip-wrapper ${className || ''}`}>
      {children}
      <Grid className="custom-tooltip-content">
        {title}
      </Grid>
    </Grid>
  );
});

export default CustomTooltip;
