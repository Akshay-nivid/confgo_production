import { BasicPlanSvg } from '@/assets/svg';
import routes from '@/router/routes';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useStore from '@/Libs/store';

/**
 * Plan Card component
 * @returns
 */
export const PlanCard = () => {
  const setDataById = useStore((state: any) => state?.setDataById);
  const navigate = useNavigate();
  return (
    <Box className=" plancard__container">
      <Box className="plancard__content">
        <Box display={'flex'} className="plancard__header">
          <BasicPlanSvg className=" plancard__icon" />

          <Box className="plancard__title-container">
            <Typography className="plancard__title text-p1">
              Basic Plan
            </Typography>
            <Typography className="plancard__subtitle text-p2">
              Perfect for Small Events
            </Typography>
          </Box>
        </Box>
        <Typography className="plancard__price text-h3">
          $12,99 <span className="plancard__price-period text-p2">/$12,99</span>
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
          onClick={() => {
            setDataById('register', { data: 'CREATE_ACCOUNT_PAGE' });
            navigate(routes.register());
          }}
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
