import Box from "@mui/material/Box/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography/Typography";
import "./_style.scss";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import CustomButton from "@/components/CustomButton/CustomButton";

/**
 * static ui banner component for home page and features page
 * @returns
 */
const ViewPricingBanner = () => {
  const navigate = useNavigate();
  return (
    <Grid container className={"plan-selection-banner"}>
      <Grid size={1} className="plan-selection-banner__spacer"></Grid>
      <Grid size={10} className={"plan-selection-banner__content"}>
        <Box className="plan-selection-banner__content-header">
          <Typography
            textAlign={"center"}
            className="plan-selection-banner__content-header-title"
          >
            Choose Your Conference <br /> Web App Plan!
          </Typography>
          <Typography
            textAlign={"center"}
            className="plan-selection-banner__content-header-subtitle"
          >
            Discover the Perfect Package to Elevate Your Event Experience
          </Typography>
          <Box className="plan-selection-banner__button-container">
            <CustomButton
              onClick={() => {
                navigate(routes.pricing());
              }}
              variant="contained"
              label="View Pricing"
            />
            <CustomButton
              label={"Contact Us"}
              variant="outlined"
              onClick={() => {
                navigate(routes.contact());
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Grid size={1} className="plan-selection-banner__spacer"></Grid>
    </Grid>
  );
};

export default ViewPricingBanner;
