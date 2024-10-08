import { SeamlessIntegration } from "@/assets/svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * service card ui component for home page
 *
 */
export const ServiceCard = () => {
  return (
    <Box className="service-card ">
      <SeamlessIntegration className="service-card__icon" />
      <Box>
        <Typography
          textAlign={"center"}
          className="service-card__title text-h5 font-700"
        >
          24/7 Support*
        </Typography>
        <Typography
          textAlign={"center"}
          className="text-p1 service-card__description"
        >
          Need help anytime? Our support team is available 24/7 to answer your
          queries and offer timely solutions.
        </Typography>
      </Box>
    </Box>
  );
};
