import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button/Button';
import { BasicPlanSvg } from '@/assets/svg';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';

/**
 * pricing page component
 * @returns
 */
const Pricing = () => {
  return (
    <Grid
      bgcolor={'white'}
      container
      paddingTop={'14.8rem'}
      className="pricing-main"
    >
      <Grid size={1}></Grid>
      <Grid size={10}>
        <Box width={'100%'}>
          <Grid container>
            <Grid size={12} marginBottom={'4.41rem'}>
              <Typography
                textAlign={'center'}
                marginBottom={'0.833rem'}
                className="text-h1 font-700"
              >
                Simple Pricing For Everyone
              </Typography>
              <Typography variant="h6" textAlign={'center'}>
                Everything you might need and then some more in an accessible
                and intuitive package.
              </Typography>
            </Grid>
            <Grid
              size={12}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              marginBottom={'5rem'}
            >
              <Box>
                <Button>Monthly</Button>
                <Button>Annually</Button>
              </Box>
            </Grid>
            <Grid size={12} marginBottom={'7.75rem'}>
              <Box width={'100%'}>
                <Grid container columnSpacing={'1.67rem'}>
                  {new Array(3).fill('').map(() => (
                    <Grid size={4}>
                      <PlanCard />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            <Grid size={12} marginBottom={'7.5rem'}>
              <Typography
                className="text-h2"
                textAlign={'center'}
                fontWeight={700}
              >
                Plan Feature
              </Typography>
              <Typography className="text-p1" textAlign={'center'}>
                Here’s an easy to understand comparison table between the
                features you get in the Free <br /> version versus our Pro
                version.
              </Typography>
            </Grid>
            <Grid size={12}>
              <Box width={'100%'}>
                <Grid container columnSpacing={1.667} marginBottom={9.167}>
                  {Array(4)
                    .fill(null)
                    .map(() => (
                      <Grid size={3}>{/* <ServiceCard /> */}</Grid>
                    ))}
                </Grid>
              </Box>
            </Grid>
            <Grid size={12} className="" marginBottom="5.333rem">
              <Typography textAlign={'center'} className="text-h5 font-700">
                Frequently asked questions
              </Typography>
              <Typography textAlign={'center'} className="text-p1">
                Find solutions, clarifications, and insights to the most
                commonly asked questions <br /> about our products, services,
                and processes.
              </Typography>
            </Grid>
            <Grid size={12} marginBottom={'9.16rem'}>
              {/* <FAQ />
              <FAQ />
              <FAQ />
              <FAQ />
              <FAQ />
              <FAQ /> */}
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid size={1}></Grid>
    </Grid>
  );
};

export default Pricing;

const PlanCard = () => {
  const navigate = useNavigate();
  return (
    <Box
      padding={'1.25rem'}
      className="bg-gradient-to-b from-[#F1F1F1] to-transparent"
      borderRadius={'2.5rem'}
    >
      <Box
        bgcolor={'white'}
        width={'100%'}
        paddingBlock={'2.083rem'}
        paddingInline={'1.833rem'}
        borderRadius={'1.85rem'}
        boxShadow="rgba(0, 0, 0, 0.24) 0rem 0.25rem 0.667rem"
      >
        <Box marginBottom={'2.91rem'} display={'flex'} columnGap={'1.3rem'}>
          <BasicPlanSvg className="w-[4.91rem] h-[4.91rem]" />

          <Box>
            <Typography variant="body1">Basic Plan</Typography>
            <Typography>Perfect for Small Events</Typography>
          </Box>
        </Box>
        <Typography marginBottom={'3.83rem'}>
          $12,99 <span>/$12,99</span>
        </Typography>
        <Box className="space-y-[1.85rem]" marginBottom={'5.16rem'}>
          {Array.from({ length: 5 }).map(() => (
            <Box>
              <Typography className="text-p1">
                Unlimited Conferences & Members
              </Typography>
            </Box>
          ))}
        </Box>
        <Button
          onClick={() => {
            navigate(routes.addOrganization());
          }}
          fullWidth
          variant="contained"
        >
          Choose This Plan
        </Button>
      </Box>
    </Box>
  );
};
