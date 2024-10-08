import { OnlinePayment, SeamlessIntegration } from "@/assets/svg";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

/**
 *
 * card component to display features of the platform
 * @returns
 */
const FeatureCard = ({
  flexDirection = "row",
}: {
  flexDirection?: "row" | "row-reverse";
}) => {
  const isReversed = flexDirection === "row-reverse";

  return (
    <Grid container className={`feature-card ${isReversed ? "reversed" : ""}`}>
      <Grid size={6} className="feature-card__image-container">
        <OnlinePayment className="feature-card__image" />
      </Grid>
      <Grid size={6} className="feature-card__content">
        <Box className="feature-card__header">
          <Typography className="feature-card__title">
            Social Promotion
          </Typography>
          <Typography className="feature-card__description">
            Amplify your conference's reach with our powerful Social Promotion
            feature. Seamlessly integrate social media platforms to promote your
            event and engage with a wider audience. Share updates,
            announcements, and highlights directly from the platform to your
            followers. Encourage participants to spread the word with
            easy-to-use sharing tools. Leverage the power of social networks to
            boost visibility, attract more attendees, and create a buzz around
            your event. Maximize your conference's impact with a strong online
            presence.
          </Typography>
        </Box>
        <Box className="feature-card__features">
          <Grid container className="feature-card__features-grid">
            <Grid className="feature-card__feature">
              <SeamlessIntegration className="feature-card__feature-icon" />
              <Box className="feature-card__feature-content">
                <Typography className="feature-card__feature-title">
                  Seamless Integration
                </Typography>
                <Typography className="feature-card__feature-description">
                  Effortlessly connect your conference with popular social media
                  platforms, making it easy to share updates and engage with
                  your audience.
                </Typography>
              </Box>
            </Grid>
            <Grid className="feature-card__feature">
              <SeamlessIntegration className="feature-card__feature-icon" />
              <Box className="feature-card__feature-content">
                <Typography className="feature-card__feature-title">
                  Seamless Integration
                </Typography>
                <Typography className="feature-card__feature-description">
                  Effortlessly connect your conference with popular social media
                  platforms, making it easy to share updates and engage with
                  your audience.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Button variant="outlined" className="feature-card__button">
          Get Started
        </Button>
      </Grid>
    </Grid>
  );
};

export default FeatureCard;
