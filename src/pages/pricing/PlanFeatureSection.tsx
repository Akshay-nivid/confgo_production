import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import { CheckIcon } from '@/assets/svg';


/**
 * Plan Feature Section ui component
 * @returns
 */
const PlanFeatureSection = () => {
  const features = [
    {
      title: 'Online Payment Support',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Entry Via QR Scanner',
      basic: true,
      standard: true,
      pro: true,
    },
    {
      title: 'Customizable',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Unlimited Conference & Members',
      basic: false,
      standard: true,
      pro: true,
    },
    {
      title: 'Attendees Management',
      basic: false,
      standard: false,
      pro: true,
    },
  ];

  return (
    <Grid
      container
      className="planfeaturesection__container"
    >
      <Grid size={2}></Grid>
      <Grid container size={8} className="planfeaturesection__content">
        <Grid
          size={12}
          className="planfeaturesection__header"
        >
          <Typography
            textAlign={'center'}
            className="planfeaturesection__title text-h2 font-700"
          >
            Plan Features
          </Typography>
          <Typography
            textAlign={'center'}
            className="planfeaturesection__description text-p1"
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
            paddingBlock={'1.4rem'}
            marginBottom={'2rem'}
            borderBottom={'1px solid #E0E0E0'}
            className="planfeaturesection__table-row"
          >
            <Grid size={6} className="planfeaturesection__table-cell">
              <Typography className="text-h6 font-500">
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
      <Grid size={2}></Grid>
    </Grid>
  );
};

export default PlanFeatureSection;
