import { gridMiddleImg } from "@/assets/images";
import { GridEndOneImg, GridEndTwoImg } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

/**
 * HeroSection component => first section of the home page
 * @returns {JSX.Element}
 */

const HeroSection = () => {
  return (
    <Grid container className="hero-section-main">
      <Grid size={1} className="hero-section-spacer"></Grid>
      <Grid size={10} className="hero-section-content">
        <Box className="hero-section-container">
          <Box className="hero-section-text-container">
            <Typography
              textAlign={"center"}
              className="hero-section-title text-h1 font-700"
            >
              Your Ultimate <br /> Conference Software.
            </Typography>
            <Typography
              className="hero-section-description text-p1 font-400"
              textAlign={"center"}
            >
              Are you tired of juggling multiple tools and platforms to organize
              your conferences and group meetings? Look no <br /> further!
              Summit Pro is here to revolutionize your event management
              experience.
            </Typography>

            <Box className="hero-section-buttons">
              <CustomButton
                variant="contained"
                label="Get Started"
              ></CustomButton>
              <CustomButton
                variant="outlined"
                label="Watch Our Videos"
                className="hero-section-button"
              >
                {/* Watch Our Videos */}
              </CustomButton>
            </Box>
          </Box>
          <Grid size={12} className="hero-section-image-grid">
            <Box
              width={"100%"}
              height={"100%"}
              className="hero-section-image-container"
            >
              <Grid
                container
                columnSpacing={2}
                className="hero-section-image-row"
              >
                <Grid size={2} className="hero-section-left-column">
                  <Box className="hero-section-side-box">
                    <Grid container className="hero-section-side-grid">
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <Box width={"100%"}>
                          <GridEndOneImg className="hero-section-side-image-large " />
                        </Box>
                      </Grid>
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <Box width={"100%"}>
                          <GridEndTwoImg className="hero-section-side-image-small " />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid size={8} className="hero-section-middle-column">
                  <img
                    className="hero-section-middle-image"
                    src={gridMiddleImg}
                    alt=""
                  />
                </Grid>
                <Grid size={2} className="hero-section-right-column">
                  <Box height={"100%"} className="hero-section-side-box">
                    <Grid container className="hero-section-side-grid">
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <Box width={"100%"}>
                          <GridEndOneImg className="hero-section-side-image-large " />
                        </Box>
                      </Grid>
                      <Grid
                        size={12}
                        className="hero-section-side-image-wrapper"
                      >
                        <Box width={"100%"}>
                          <GridEndTwoImg className="hero-section-side-image-small " />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Box>
      </Grid>
      <Grid size={1} className="hero-section-spacer"></Grid>
    </Grid>
  );
};

export default HeroSection;
