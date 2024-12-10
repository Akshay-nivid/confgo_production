
import { Card, CardContent, Typography, Box } from "@mui/material";
import React from "react";
import { FC } from "react";

interface DashboardCardItemProps {
  icon: FC<React.SVGProps<SVGSVGElement>>; // SVG component
  title: string;
  onClick?: () => void;
  count:number;
  className?: string; // Optional prop for additional class names
  iconClassName?: string; // Optional prop for the icon's class name
  titleClassName?: string; // Optional prop for the title's class name
  countClassName?: string; // Optional prop for the count's class name
  contentClassName?: string;
}

/**
 * Reusable card component for the dashboard
 * @author Neethu
 */
const DashboardCardItem: React.FC<DashboardCardItemProps> = React.memo(({ icon: Icon, title, onClick,count,className = "", 
  iconClassName = "", 
  titleClassName = "", 
  countClassName = "" ,
  contentClassName = "" }) => (
 
  <Card variant="outlined" className={`dashboard-card ${className}`}  onClick={onClick}>
    <CardContent className={`${contentClassName}`}>
      <Box className={`dashboard-card-icon ${iconClassName}`} display="flex" justifyContent="left" mb={2}>
        {Icon && <Icon />}
      </Box>
      <Typography className={`dashboard-card-title ${titleClassName}`}  component="div"  >
        {title}
      </Typography>
      <Typography className={`dashboard-card-count ${countClassName}`}  component="div" >
        {count}
      </Typography>
    </CardContent>
  </Card>
));

export default DashboardCardItem;
