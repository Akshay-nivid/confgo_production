import CustomButton from "@/components/CustomButton/CustomButton";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import FeatureCard from "./FeatureCard";
import { ArrowIconSvg, SeamlessIntegration } from "@/assets/svg";

/**
 * feature section ui component for home page
 *
 */


const features = [
  {
    title: "Social Promotion",
    description: "Amplify your conference's reach with our powerful Social Promotion feature. Seamlessly integrate social media platforms to promote your event and engage with a wider audience. Share updates, announcements, and highlights directly from the platform to your followers. Encourage participants to spread the word with easy-to-use sharing tools. Leverage the power of social networks to boost visibility, attract more attendees, and create a buzz around your event. Maximize your conference's impact with a strong online presence.",
    features: [
      {
        key: "social-promotion-1",
        title: "Seamless Integration",
        description: "Effortlessly connect your conference with popular social media platforms, making it easy to share updates and engage with your audience.",
        icon: <SeamlessIntegration className="feature-card__feature-icon" />
      },
      {
        key: "social-promotion-2",
        title: "Share Updates",
        description: "Share updates, announcements, and highlights directly from the platform to your followers.",
        icon: <ShareUpdates className="feature-card__feature-icon" />
      },
    ]
  }
]
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
