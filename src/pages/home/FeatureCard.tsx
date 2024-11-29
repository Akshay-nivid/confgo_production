import { ArrowIconSvg  } from "@/assets/svg";
import routes from "@/router/routes";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
/**
 * card component to display features of the platform
 */
const FeatureCard = ({
  flexDirection = "row",
  title ,
  description,
  className,
  features,
}: {
    flexDirection?: "row" | "row-reverse";
    title: string;
    description: string;
    className?: string;
    features?: {
      key?: string;
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    }[];
}) => {
  const isReversed = flexDirection === "row-reverse";
  const navigate = useNavigate();

  return (
    <Grid container className={clsx("feature-card", isReversed ? "reversed" : "")}>
      <Grid size={6} className={clsx("feature-card__image-container ", className)}>
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
            {features?.map((feature)=>(
              <Grid key={feature?.key} className="feature-card__feature">
              {feature?.icon}
              <Box className="feature-card__feature-content">
                <Typography className="feature-card__feature-title">
                  {feature?.title}
                </Typography>
                <Typography className="feature-card__feature-description">
                 {feature?.description}
                </Typography>
              </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Button variant="outlined" className="feature-card__button" endIcon={<ArrowIconSvg/>} onClick={() => navigate(routes.loginOrg())}>
          Get Started
        </Button>
      </Grid>
    </Grid>
  );
};

export default FeatureCard;
