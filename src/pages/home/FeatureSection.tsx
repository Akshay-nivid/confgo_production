import CustomButton from "@/components/CustomButton/CustomButton";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FeatureCard from "./FeatureCard";
import { ArrowIconSvg } from "@/assets/svg";

/**
 * feature section ui component for home page
 *
 */
const FeatureSection = () => {
  return (
    <Grid container className="feature-section-main">
      <Grid size={1}></Grid>
      <Grid container size={10}>
        <Grid size={12} className="feature-section-main__header">
          <Typography
            textAlign={"center"}
            className="feature-section-main__header-title text-h5 font-700"
          >
            Powerful Features for Seamless Conferences
          </Typography>
          <Typography
            className="feature-section-main__header-description text-p1"
            textAlign={"center"}
          >
            Discover the tools that enhance your meetings and elevate your
            events.
          </Typography>
          <Box className="feature-section-main__header-button-container">
            <CustomButton
              label="See All Features"
              className="feature-section-main__header-button-container-feature-all-button"
              variant="outlined"
              endIcon={<ArrowIconSvg/>}
            />
          </Box>
        </Grid>

        <FeatureCard flexDirection="row" />
        <FeatureCard flexDirection="row-reverse" />
        <FeatureCard flexDirection="row" />
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
};

export default FeatureSection;
