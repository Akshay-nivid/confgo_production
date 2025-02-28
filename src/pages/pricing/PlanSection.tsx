// import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import { PlanCard } from './PlanCard';
import Typography from '@mui/material/Typography/Typography';
import { useEffect, useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

/**
 * Plan Section ui component
 * @returns
 */

type PlanType = {
  id: number;
  name: string;
  amount: string;
  currency: string | null;
  validityDay: number;
  statusId: number;
  assetId: string | null;
  createdBy: string | null;
  createdOn: string;
  description: string | null;
  modifiedBy: string | null;
  modifiedOn: string;
  planPropertyAssignments: Array<[]> | null;
};
/**
 * Component used to draw plan
 * @returns 
 */
export const PlanSection = () => {

  const [planList, setPlanList] = useState<PlanType[]>([]);
  // const [selectedPlan, setSelectedPlan] = useState('Monthly');
  const location = useLocation();
  const currentUrl = location.pathname; 
  /**
   * Method sued to set selected plan
   * @param plan 
   */
  // const handleSelection = (plan: string) => {
  //   setSelectedPlan(plan);
  // };
  /*
   * get state data if selected plan data is there
   */
  useEffect(() => {
    getPlanData();
  }, []);

  /**
   * Method used to call plan list API
   */
  const getPlanData = async () => {
    try {
      const response = await apiClient.post(`plan/list`, {});
      const { status, data } = processAPIResponse(response, 'plan list');
      if (status) {
        setPlanList(data);
      }
    } catch (error) {
      Logger.error(error)
    }
  }

  return (
    <Grid container justifyContent={'center'} className="plansection__container">
      <Grid container size={{ xs: 12, sm:currentUrl=='/pricing'?10: 12 }} className="plansection__header">
        <Grid size={12}>
          <Typography className="plansection__title">
            Choose Your Plan
          </Typography>
          <Typography className="plansection__subtitle">
            Everything you might need and then some more in an accessible and
            intuitive package.
          </Typography>
        </Grid>
        <Grid
          size={12}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          className="plansection__button-container"
        >
          {/* <Grid className='plansection__button-group'>
            <CustomButton label="Monthly" variant={selectedPlan === 'Monthly' ? 'contained' : 'outlined'} onClick={() => handleSelection('Monthly')} />
            <CustomButton label="Annualy" variant={selectedPlan === 'Annualy' ? 'contained' : 'outlined'} onClick={() => handleSelection('Annualy')} />
          </Grid> */}
        </Grid>
        <Grid
          size={12}
          display={'flex'}
          columnSpacing={{ xs: 1, md: 2 }}
          rowSpacing={{ xs: 1, md: 0 }}
          container
          className="plansection__cards"
        >
          {planList && planList.length > 0 ? (
            planList.map((row, index) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                key={index}
                spacing={2}
                className="plansection_card"
              >
                <PlanCard data={row} />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs:12, sm:12 }} display="flex" justifyContent="center">
              <CircularProgress />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
