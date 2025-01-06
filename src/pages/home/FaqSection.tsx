import CustomAccordion from "@/components/CustomAccordion/CustomAccordion";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

type DataProps = {
  title: string,
  description: string
}
/**
 * faq section ui component for home page
 */

const FaqSection = () => {

  const faqDetails = [
    { title: 'What features does Confgo offer for conference management?', description: 'Confgo provides a range of tools, including attendee management, payment tracking, member coordination, speaker organization, and video management, all within a single platform.' },
    { title: 'Can Confgo handle both physical and virtual conferences?', description: '' },
    { title: 'How does Confgo ensure data security?', description: '' },
    { title: 'Is Confgo available for small and large organizations?', description: '' },
    { title: 'Does Confgo offer mobile app support for attendees?', description: '' },
    { title: 'How can I get assistance with Confgo?', description: '' }
  ]

  return (
    <Grid container className="faq-section">
      <Grid size={1} className="faq-section__spacer"></Grid>
      <Grid size={10} className="faq-section__content">
        <Grid size={12} className="faq-section__header">
          <Typography
            className="faq-section__header-title"
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
          {faqDetails?.map((item: DataProps, index) => (
            <>
              <CustomAccordion key={item.title} data={item} />
              {faqDetails?.length - 1 !== index && <div className="underline"></div>}
            </>
          ))}
        </Grid>
      </Grid>
      <Grid size={1} className="faq-section-spacer"></Grid>
    </Grid>
  );
};

export default FaqSection;
