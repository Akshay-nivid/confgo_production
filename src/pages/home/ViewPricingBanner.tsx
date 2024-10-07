import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography/Typography";
import "./_style.scss";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";

/**
 * static ui banner component for home page and features page
 * @returns
 */
const ViewPricingBanner = () => {
  const navigate = useNavigate();
  return (
    <Grid container className={"plan-selection-banner"}>
      <Grid size={12}>
        <Box>
          <Typography textAlign={"center"}>
            Choose Your Conference <br /> Web App Plan!
          </Typography>
          <Typography textAlign={"center"}>
            Discover the Perfect Package to Elevate Your Event Experience
          </Typography>
          <Box className="plan-section-button-container">
            <Button
              onClick={() => {
                navigate(routes.pricing());
              }}
              variant="contained"
            >
              View Pricing
            </Button>
            <Button variant="outlined">Contact Us</Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ViewPricingBanner;
