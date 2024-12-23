import React, { ReactNode } from 'react';
import Grid from '@mui/material/Grid2';
interface CustomTooltipProps {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}

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
