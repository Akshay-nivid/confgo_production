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
    { title: 'Can Confgo handle both physical and virtual conferences?', description: ' Yes, Confgo supports both physical and virtual conferences by managing registrations, schedules, attendees, and sessions for both formats.' },
    { title: 'How does Confgo ensure data security?', description: 'Confgo ensures data security through encryption, secure authentication, role-based access control, and compliance with industry standards.' },
    { title: 'Is Confgo available for small and large organizations?', description: ' Yes, Confgo is designed for both small and large companies, offering scalable plans to meet different event management needs.' },
    { title: 'Does Confgo offer mobile app support for attendees?', description: 'Yes, Confgo offers mobile app support for attendees, allowing them to access event details, schedules, and updates on the go.' },
    { title: 'How can I get assistance with Confgo?', description: 'You can get assistance from Confgo through our support team via email or by visiting our help center on the website for FAQs.' }
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
