import { BasicPlanSvg } from '@/assets/svg';
import routes from '@/router/routes';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useStore from '@/Libs/store';
import { toCamelCase } from '@/Utils/CommonBaseClass';

/**
 * Plan Card component
 * @returns
 */
type PlanCardProps = {
  data: any;
};
export const PlanCard: React.FC<PlanCardProps> = ({ data }) => {

  const setDataById = useStore((state) => state?.setDataById);
  const navigate = useNavigate();

  const mode = useStore((state) => state?.compData?.planMode?.mode);

  /**
   * It updates the global state based on the mode and navigates to the appropriate route.
   */
  const handleButtonClick = () => {
    if (mode === 'register') {
      setDataById('register', { data: 'CREATE_ACCOUNT_PAGE', step: 2 });
      setDataById('form1', { field_values: { ...data } });
      navigate(routes.register());
    }else{
      setDataById('planDetails', { field_values: { ...data } });
      navigate(routes.upgradePlanPayment());
    }
  };
  return (
    <Box className=" plancard__container">
      <Box className="plancard__content">
        <Box display={'flex'} className="plancard__header">
          <BasicPlanSvg className=" plancard__icon" />
          <Box className="plancard__title-container">
            <Typography className="plancard__title text-p1">
              {toCamelCase(data?.name) }
            </Typography>
            <Typography className="plancard__subtitle text-p2">
              {data.description}
            </Typography>
          </Box>
        </Box>
        <Typography className="plancard__price text-h3">
          ${data.amount} <span className="plancard__price-period text-p2">/${data.amount}</span>
        </Typography>
        <Box className=" plancard__features">
          {Array.from({ length: 5 }).map((_, index) => (
            <Box key={index} className="plancard__feature">
              <Typography className="text-p1">
                Unlimited Conferences & Members
              </Typography>
            </Box>
          ))}
        </Box>
        <Button
          onClick={handleButtonClick}
          fullWidth
          variant="contained"
          className="plancard__button"
        >
          Choose This Plan
        </Button>
      </Box>
    </Box>
  );
};
