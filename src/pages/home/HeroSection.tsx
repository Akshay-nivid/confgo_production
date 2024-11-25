import { PlayIconSvg, HomeEvent } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import routes from "@/router/routes";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

/**
 * HeroSection component => first section of the home page
 * @returns {JSX.Element}
 */

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Grid container justifyContent={'center'} alignItems={'center'} className="hero-section-main">
      <Grid size={12} className="hero-section-content">
        <Grid className="hero-section-container">
          <Typography
            textAlign={"center"}
            className="hero-section-title text-h1 font-700"
          >
            Your All-in-One <br /> Conference Solution.
          </Typography>
          <Typography
            className="hero-section-description text-p1 font-400"
            textAlign={"center"}
          >
            Tired of juggling multiple tools and platforms to organize conferences and group meetings? Look no further— <br />
            Summit Pro is here to transform your event management experience!
          </Typography>

          <Grid container className="hero-section-buttons">
            <CustomButton
              variant="contained"
              label="Get Started"
              className="get-started-button"
              onClick={() => navigate(routes.loginOrg())}
            />
            <CustomButton
              startIcon={<PlayIconSvg />}
              variant="outlined"
              label="Watch Our Videos"
              className="watch-video-button"
            />
          </Grid>
        </Grid>
        <Grid container justifyContent={'center'} alignItems={'center'} size={12} className="hero-section-image-grid">
          <HomeEvent />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HeroSection;
