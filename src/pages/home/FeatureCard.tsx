import { ArrowIconSvg, SeamlessIntegration } from "@/assets/svg";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
/**
 * card component to display features of the platform
 */
const FeatureCard = ({
  flexDirection = "row",
  title ,
  description,
  features,
}: {
    flexDirection?: "row" | "row-reverse";
    title: string;
    description: string;
    features: {
      key: string;
      title: string;
      description: string;
      icon: React.ReactNode;
    }[];
}) => {
  const isReversed = flexDirection === "row-reverse";

  return (
    <Grid container className={`feature-card ${isReversed ? "reversed" : ""}`}>
      <Grid size={6} className="feature-card__image-container">
      </Grid>
      <Grid size={6} className="feature-card__content">
        <Box className="feature-card__header">
          <Typography className="feature-card__title">
            {title}
          </Typography>
          <Typography className="feature-card__description">
           {description}
          </Typography>
        </Box>
        <Box className="feature-card__features">
          <Grid container className="feature-card__features-grid">
            {features.map((feature)=>(
              <Grid key={feature.key} className="feature-card__feature">
              {feature.icon}
              <Box className="feature-card__feature-content">
                <Typography className="feature-card__feature-title">
                  {feature.title}
                </Typography>
                <Typography className="feature-card__feature-description">
                 {feature.description}
                </Typography>
              </Box>
            </Grid>
            ))}
            {/* <Grid className="feature-card__feature">
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
            </Grid> */}
          </Grid>
        </Box>
        <Button variant="outlined" className="feature-card__button" endIcon={<ArrowIconSvg/>}>
          Get Started
        </Button>
      </Grid>
    </Grid>
  );
};

export default FeatureCard;
