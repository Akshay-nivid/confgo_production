
import { Card, CardContent, Typography, Box } from "@mui/material";


/**
 * Reusable card component for the dashboard
 * @param {Object} props
 * @param {ReactNode} props.icon - The icon to display at the top of the card
 * @param {string} props.title - The title of the card
 * @param {ReactNode} [props.children] - Additional content for the card
 */
const DashboardCardItem = ({ icon, title}:any) => (
  
  <Card variant="outlined" sx={{ textAlign: "center", padding: 2 }}>
  <CardContent>
    <Box display="flex" justifyContent="center" mb={2}>
      {icon}
    </Box>
    <Typography variant="h6" component="div">
      {title}
    </Typography>
  </CardContent>
</Card>
);

export default DashboardCardItem;
