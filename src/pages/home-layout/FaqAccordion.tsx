import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * faq accordion ui card component for home page
 *
 */
const FAQCard = () => {
  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          borderBottom: "1px solid #E0E0E0",
          "&.Mui-expanded": {
            borderBottom: "none",
          },
        }}
      >
        <Typography fontWeight={600}>
          Can Confgo handle both physical and virtual conferences?
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Answer to the question goes here...</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default FAQCard;
