
import { Card, CardContent, Typography, Box } from "@mui/material";
import React from "react";
import { FC } from "react";

interface DashboardCardItemProps {
  icon: FC<React.SVGProps<SVGSVGElement>>; // SVG component
  title: string;
  onClick?: () => void;
}

/**
 * Reusable card component for the dashboard
 * @author Neethu
 */
const DashboardCardItem: React.FC<DashboardCardItemProps> = React.memo(({ icon: Icon, title, onClick }) => (
 
  <Card variant="outlined" className="dashboard-card" onClick={onClick}>
    <CardContent>
      <Box className="dashboard-card-icon" display="flex" justifyContent="center" mb={2}>
        {Icon && <Icon />}
      </Box>
      <Typography className="dashboard-card-title" component="div">
        {title}
      </Typography>
    </CardContent>
  </Card>
));

export default DashboardCardItem;
