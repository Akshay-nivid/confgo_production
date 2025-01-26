import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  RadioGroup,
  Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore from "@/Libs/store/store";
import PlanCard from "@/components/PlanCard";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import { ArrowIconSvg, BasicPlainIcon, ProPlanIcon, StandardPlanIcon } from "@/assets/svg";
import { Logger } from "@/Utils/Logger";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse} from "@/Utils/CommonBaseClass";

/*
 * compoent to render the plan
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
  planPropertyAssignments: any[]; 
};
const AddPlan = React.memo(() => {
  const [currentPlan, setcurrentPlan] = useState('');
  const form1 = useStore((state: any) => state?.compData?.['form1']) ?? [];
  const setDataById = useStore((state: any) => state.setDataById)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setcurrentPlan(event.target.value);
  };
  const [planList,setPlanList]=useState<PlanType[]>([]);
  /*
   * get state data if selected plan data is there
   */
  useEffect(() => {
    const fetchData = async () => {
      await getPlanData();
      setDataById('register', { data: 'PLAN_PAGE', step: 1 });
  
      if (form1?.field_values) {
        setcurrentPlan(form1.field_values.name);
      }else{

      }
    };
  
    fetchData();
  }, []);

  const getPlanData = async () => {
    try {
      const response = await apiClient.post(`plan/list`, {});
      const { status, data } = processAPIResponse(response, 'plan list');
      if (status) {
        setPlanList(data);
        if(form1?.field_values){
          setcurrentPlan(form1?.field_values?.name)
        }else{
          setcurrentPlan(data?.[0]?.name)
        }
        
      }

    } catch (error) {
      Logger.error(error)
    }
    finally {
      setLoading(false); 
    }
  } 

  const mode = useStore((state) => state?.compData?.planMode?.mode);
  /*
   * function to change the state and store selected plan
   */
  const handleClick = () => {
    const planDetail = planList.find((item) => item.name === currentPlan);
    if (mode === 'register') {
      setDataById('register', { data: 'CREATE_ACCOUNT_PAGE', step: 2 });
      setDataById('form1', { field_values: planDetail });
    }else{
    setDataById('planDetails', { field_values: { ...planDetail } });
    navigate(routes.upgradePlanPayment());
    }
  }
  /*
 * function to handle view plan details
 */
  const handleViewPlanDetails=()=>{
    if (mode === 'register') {
    navigate(routes.pricing());}
    else{
      navigate(routes.planUpgradePricing())
    }
  }

  const planMapper: Record<string, React.ReactNode> = {
    "BASIC_PLAN": <BasicPlainIcon />,
    "STANDARD_PLAN": <StandardPlanIcon />,
    "PRO_PLAN": <ProPlanIcon />
  }

  return (
    <Grid className="signup-content-wrapper">
      <Grid className="left-inner-content">
        <FormControl className="w-full">
          <Grid alignSelf={"center"}>
            <Typography className="left-plan-text" textAlign={"center"} lineHeight={2} >Choose Your Plan</Typography>
            <Typography className="left-description-text" textAlign={"center"} variant="h6">Everything you might need and then some more in an accessible and intuitive package.</Typography>
          </Grid>
          <RadioGroup
            className="space-y-[1rem]"
            value={currentPlan}
            onChange={handleChangePlan}
          >
            {planList.map((plan) => {
              return <PlanCard
                image={planMapper[plan?.name]}
                isActive={currentPlan === plan?.name}
                key={plan?.id}
                value={plan?.name}
                header={plan?.name}
                price={plan?.amount}
                discount={''}
                isDicount={false}
              />
})}
          </RadioGroup>
        </FormControl>
        <Grid container className="view-all-plans" alignSelf={"flex-end"} onClick={handleViewPlanDetails}>
          <Typography className="cursor-container" variant="h5">View all Pricing details?</Typography>
        </Grid>
        <Grid container mb={2} className="w-full" >
          <CustomButton
            className={(loading || planList.length === 0) ? 'plan-disabled-choose-btn signup-plan-btn' : "plan-choose-btn signup-plan-btn"}
            endIcon={<ArrowIconSvg />}
            onClick={handleClick}
            label="Choose Plan and Proceed"
            size="large"
            disabled={loading || planList.length === 0}
          />
        </Grid>
      </Grid>
    </Grid>
  )
});

export default AddPlan;