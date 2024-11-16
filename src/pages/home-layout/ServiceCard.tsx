import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FC } from "react";

/**
 * service card ui component for home page
 *
 */
type DataType = {
  Icon: FC<React.SVGProps<SVGSVGElement>>; // SVG component
  title: string,
  description: string
}
export const ServiceCard: React.FC<any> = ({ data }) => {
  const { Icon, title, description } = data;
  return (
    <Box className="service-card ">
      <Icon className="service-card_icon"/>
      <Box>
        <Typography
          textAlign={"center"}
          className="service-card__title text-h5 font-700"
        >
          {title}
        </Typography>
        <Typography
          textAlign={"center"}
          className="text-p1 service-card__description"
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};
