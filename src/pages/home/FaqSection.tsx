import FAQCard from "@/pages/home-layout/FaqAccordion";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

/**
 * faq section ui component for home page
 *
 */
const FaqSection = () => {
  return (
    <Grid container className="faq-section">
      <Grid size={1} className="faq-section__spacer"></Grid>
      <Grid size={10} className="faq-section__content">
        <Grid size={12} className="faq-section__header">
          <Typography
            className="faq-section__header-title text-h5 font-700"
            textAlign={"center"}
          >
            Frequently asked questions
          </Typography>
          <Typography
            textAlign={"center"}
            className="faq-section__header-description text-p1"
          >
            Find solutions, clarifications, and insights to the most commonly
            asked questions <br /> about our products, services, and processes.
          </Typography>
        </Grid>
        <Grid size={12} className="faq-section__cards">
          <FAQCard />
          <FAQCard />
          <FAQCard />
          <FAQCard />
          <FAQCard />
          <FAQCard />
        </Grid>
      </Grid>
      <Grid size={1} className="faq-section-spacer"></Grid>
    </Grid>
  );
};

export default FaqSection;
