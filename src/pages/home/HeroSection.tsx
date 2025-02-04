import { useIsMobileScreen } from "@/Utils/CommonBaseClass";
import { MainHeroImage } from "@/assets/svg";
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
  const isMobileScreen = useIsMobileScreen();
  return (
    <Grid container justifyContent={'center'} alignItems={'center'} className="hero-section-main">
      <Grid size={12} className="hero-section-content">
        <Grid className="hero-section-container">
          <Typography
            textAlign={"center"}
            className="hero-section-title"
          >
            Your Ultimate  <br /> Conference Software.
          </Typography>
          <Typography
            className="hero-section-description"
            textAlign={"center"}
          >
            Are you tired of juggling multiple tools and platforms to organize your conferences and group meetings? Look {!isMobileScreen && <br />}
            no further! Summit Pro is here to revolutionize your event management experience.
          </Typography>

          <Grid container className="hero-section-buttons">
            <CustomButton
              variant="contained"
              label="Get Started"
              className="get-started-button"
              onClick={() => navigate(routes.pricing())}
            />
            {/* <CustomButton
              startIcon={<PlayIconSvg />}
              variant="outlined"
              label="Watch Our Videos"
              className="watch-video-button"
            /> */}
          </Grid>
        </Grid>
        <Grid container justifyContent={'center'} alignItems={'center'} size={12} className="hero-section-image-grid">
          <MainHeroImage/>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HeroSection;
