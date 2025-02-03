import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import { CheckIcon } from '@/assets/svg';


/**
 * Plan Feature Section ui component
 * 
 */
const PlanFeatureSection = () => {
  const features = [

    {
      title: 'Event Website Builder (Basic Templates)',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Online Registration & Ticketing',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Payment Processing Integration (Stripe/PayPal)',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Basic Email Marketing Tools (Limited Templates & Automation)',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Attendee Management (Basic CRM)',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Standard Reporting & Analytics',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Standard Customer Support (Email Only)',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Mobile Event App (iOS & Android)',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Advanced Email Marketing (Segmentation, Automation)',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'More Customization Options (Websites & Registration Forms)',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'More Integrations (CRM, Marketing Automation)',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Enhanced Reporting & Analytics',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Priority Customer Support (Email & Phone)',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Abstract Management',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Exhibitor/Sponsor Management Tools',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Advanced AI Features (Matchmaking, Content Recommendations)',
      basic: false,
      standard: false,
      pro: true,
    },
    {
      title: 'White-labeling/Branding Options',
      basic: false,
      standard: false,
      pro: true,
    },
    {
      title: 'Custom Integrations (API Access)',
      basic: false,
      standard: false,
      pro: true,
    },
    {
      title: 'Dedicated Account Manager',
      basic: false,
      standard: false,
      pro: true,
    },
    {
      title: 'Advanced Security Features',
      basic: false,
      standard: false,
      pro: true,
    },
    {
      title: 'Premium Support (24/7 Availability)',
      basic: false,
      standard: false,
      pro: true,
    },
    {
      title: 'Custom Reporting Dashboards',
      basic: false,
      standard: false,
      pro: true,
    },
    {
      title: 'On-Site Support (Optional, Additional Cost)',
      basic: false,
      standard: false,
      pro: true,
    }
  ];

  return (
    <Grid
      container
      className="planfeaturesection__container"
      paddingInline={{ xs: 1.6,sm:0 }}
    >
      <Grid size={{xs:0,sm:2}}></Grid>
      <Grid container size={{xs:12,sm:8}} className="planfeaturesection__content">
        <Grid
          size={12}
          className="planfeaturesection__header"
        >
          <Typography
            textAlign={'center'}
            className="planfeaturesection__title"
          >
            Plan Features
          </Typography>
          <Typography
            textAlign={'center'}
            className="planfeaturesection__description"
          >
            Here's an easy to understand comparison table between the features
            you get in the <br /> Free version versus our Pro version.
          </Typography>
        </Grid>

        <Grid
          container
          size={12}
          
          className="planfeaturesection__table-header"
        >
          <Grid
            size={6}
            className="planfeaturesection__table-header-cell"
          >
            <Typography className="text-h6 font-600">
              General Features
            </Typography>
          </Grid>
          <Grid
            size={2}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            className="planfeaturesection__table-header-cell"
          >
            <Typography className="text-h6 font-600">Basic Plan</Typography>
          </Grid>
          <Grid
            size={2}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            className="planfeaturesection__table-header-cell"
          >
            <Typography className="text-h6 font-600">Standard Plan</Typography>
          </Grid>
          <Grid
            size={2}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            className="planfeaturesection__table-header-cell"
          >
            <Typography className="text-h6 font-600">Pro Plan</Typography>
          </Grid>
        </Grid>
        {features.map((data, index) => (
          <Grid
            container
            key={index}
            size={12}
            
            className="planfeaturesection__table-row"
          >
            <Grid size={6} className="planfeaturesection__table-cell">
              <Typography className="text-p1 font-500">
                {data?.title}
              </Typography>
            </Grid>
            <Grid
              size={2}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              className="planfeaturesection__table-cell"
            >
              {data.basic ? (
                <Badge
                  badgeContent={<CheckIcon className="planfeaturesection__badge-icon" />}
                  className="planfeaturesection__badge"
                />
              ) : (
                <></>
              )}
            </Grid>
            <Grid
              size={2}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              className="planfeaturesection__table-cell"
            >
              {data.standard ? (
                <Badge
                  badgeContent={<CheckIcon className="planfeaturesection__badge-icon" />}
                  className="planfeaturesection__badge"
                />
              ) : (
                <></>
              )}
            </Grid>
            <Grid
              size={2}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              className="planfeaturesection__table-cell"
            >
              {data.pro ? (
                <Badge
                  badgeContent={<CheckIcon className="planfeaturesection__badge-icon" />}
                  className="planfeaturesection__badge"
                />
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid size={{xs:0,sm:2}}></Grid>
    </Grid>
  );
};

export default PlanFeatureSection;
