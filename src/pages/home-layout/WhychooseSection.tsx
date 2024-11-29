import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { ClockIcon, IntegrationIcon, ProgressBarIcon, SecuityIcon } from '@/assets/svg';
import { ServiceCard } from './ServiceCard';

interface InfoItem {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Ensures Icon is a valid component
  title: string;
  description: string;
}

/**
 * why choose ui section component for home page
 *
 */
const WhychooseSection = () => {

  const info: InfoItem[] = [
    { Icon: ClockIcon, title: '24/7 Support*', description: `Need help anytime? Our support team is available 24/7 to answer your queries and offer timely solutions.` },
    { Icon: ProgressBarIcon, title: 'Comprehensive Management Tools', description: `Our platform delivers all-in-one solutions for managing attendees, payments, members, speakers, and videos.` },
    { Icon: SecuityIcon, title: 'Secure and Affordable', description: `Summit Pro secures your data with encryption and offers affordable pricing for all organizations.` },
    { Icon: IntegrationIcon, title: 'Seamless Integration', description: `Summit Pro unites offline and online meetings, ensuring seamless transitions between physical and virtual events.` }

  ]
  return (
    <Grid container justifyContent={'center'} className="whychoose-section">
      <Grid container size={{ xs: 12, sm: 10 }} className="whychoose-section__content">
        <Grid size={12} className="whychoose-section__header">
          <Typography
            className="whychoose-section__header-title"
            textAlign={'center'}
          >
            Why Choose Confgo?
          </Typography>
          <Typography
            className="whychoose-section__header-description"
            textAlign={'center'}
          >
            Discover the tools that enhance your meetings and elevate your
            events.
          </Typography>
        </Grid>
        <Grid size={12} container columnSpacing={5}>
          {info.map((item) => (
            <Grid size={{ xs: 12, sm: 3 }} key={item.title}>
              <ServiceCard data={item} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WhychooseSection;
