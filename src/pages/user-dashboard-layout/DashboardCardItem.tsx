
import { Card, CardContent, Typography, Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface DashboardCardItemProps {
  icon: FC<React.SVGProps<SVGSVGElement>>; // SVG component
  title: string;
  onClick?: () => void;
}

/**
 * Reusable card component for the dashboard
 * @author Neethu
 */
const DashboardCardItem: FC<DashboardCardItemProps> = ({ icon: Icon, title, onClick }) => (

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
);

export default DashboardCardItem;
