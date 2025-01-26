import routes from '@/router/routes';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useStore from '@/Libs/store/store';
import { toCamelCase } from '@/Utils/CommonBaseClass';
import Grid from "@mui/material/Grid2";
import { ArrowIconSvg, BasicPlainIcon, ProPlanIcon, StandardPlanIcon } from '@/assets/svg';
import CustomButton from '@/components/CustomButton/CustomButton';

/**
 * Plan Card component
 * @returns
 */
type PlanCardProps = {
  data: any;
  type: string;
};
export const PlanCard: React.FC<PlanCardProps> = ({ data, type }) => {

  const setDataById = useStore((state) => state?.setDataById);
  const navigate = useNavigate();


  const planMapper: Record<string, React.ReactNode> = {
    "BASIC_PLAN": <BasicPlainIcon />,
    "STANDARD_PLAN": <StandardPlanIcon />,
    "PRO_PLAN": <ProPlanIcon />
  }

  const mode = useStore((state) => state?.compData?.planMode?.mode);

  /**
   * It updates the global state based on the mode and navigates to the appropriate route.
   */
  const handleButtonClick = () => {
    if (mode === 'register') {
      setDataById('register', { data: 'CREATE_ACCOUNT_PAGE', step: 2 });
      setDataById('form1', { field_values: { ...data } });
      navigate(routes.register());
    } else {
      setDataById('planDetails', { field_values: { ...data } });
      navigate(routes.upgradePlanPayment());
    }
  };
  return (
    <Box className=" plancard__container">
      <Box className="plancard__content">
        <Box display={'flex'} className="plancard__header">
          <Grid className="plancard__icon">{planMapper[data?.name]}</Grid>
          <Grid container flexDirection={'column'}>
            <Typography className="plancard__title">
              {toCamelCase(data?.name)}
            </Typography>
            <Typography className="plancard__subtitle">
              {data.description}
            </Typography>
          </Grid>
        </Box>
        <Grid container alignItems={'center'} alignSelf={'center'} className="plancard__price_conatiner">
          <span className="price"> ${data.amount} </span>&nbsp; <span className="period">/&nbsp;{type}</span>
        </Grid>
        {/* <Box className="plancard__features">
          {Array.from({ length: 5 }).map((_, index) => (
            <Grid container flexDirection={'row'} key={index} alignItems={'center'} className="plancard__feature">
               <CheckIcon className='icon'/> &nbsp;&nbsp;<Typography className="text">
              Unlimited Conferences & Members
              </Typography>
            </Grid>
          ))}
        </Box> */}
        <CustomButton
          onClick={handleButtonClick}
          fullWidth
          className="plancard__button"
          endIcon={<ArrowIconSvg />}
          label='Choose This Plan'
        >
        </CustomButton>
      </Box>
    </Box>
  );
};
