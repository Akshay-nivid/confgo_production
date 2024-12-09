import CustomButton from '@/components/CustomButton/CustomButton';
import Grid from '@mui/material/Grid2';
import { PlanCard } from './PlanCard';
import Typography from '@mui/material/Typography/Typography';
import { useEffect, useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import { Logger } from '@/Utils/Logger';

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
  assetId: number | null;
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
  const [selectedPlan, setSelectedPlan] = useState('Monthly');

  /**
   * Method sued to set selected plan
   * @param plan 
   */
  const handleSelection = (plan: string) => {
    setSelectedPlan(plan);
  };
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
      <Grid container size={{ xs: 12, sm: 10 }} className="plansection__header">
        <Grid size={12}>
          <Typography className="plansection__title">
            Simple Pricing For Everyone
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
          <Grid className='plansection__button-group'>
            <CustomButton label="Monthly" variant={selectedPlan === 'Monthly' ? 'contained' : 'outlined'} onClick={() => handleSelection('Monthly')} />
            <CustomButton label="Annualy" variant={selectedPlan === 'Annualy' ? 'contained' : 'outlined'} onClick={() => handleSelection('Annualy')} />
          </Grid>
        </Grid>
        <Grid
          size={12}
          display={'flex'}
          columnSpacing={5}
          container
          className="plansection__cards"
        >
          {planList.map((row, index) => (
            <>
              <Grid size={{ xs: 12, sm: 4 }} key={index} className="plansection__card">
                <PlanCard data={row} type={selectedPlan} />
              </Grid>
            </>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
