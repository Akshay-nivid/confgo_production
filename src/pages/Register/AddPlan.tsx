import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  RadioGroup,
  Typography,
} from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import BasicPlanImage from '@/assets/svg/basic-plan-icon.svg';
import ProPlanImage from '@/assets/svg/pro-plan.svg';
import StandardPlanImage from '@/assets/svg/standard-plan-icon.svg';
import useStore from "@/Libs/store";
import PlanCard from "@/components/PlanCard";
import { StepperBoxes } from "./StepperBox";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
/*
 * sample plan data will be replaced after integration of api
 */
const PLANS = {
  basic: "Basic",
  proffesional: "Proffesional",
  enterprise: "Enterprise",
};

const plans = [
  {
    header: PLANS.basic,
    price: "99",
    value: PLANS.basic,
    isDicount: false,
    discount: "",
    image: <BasicPlanImage />
  },
  {
    header: PLANS.proffesional,
    price: "199",
    value: PLANS.proffesional,
    isDicount: false,
    discount: "",
    image: <ProPlanImage />
  },
  {
    header: PLANS.enterprise,
    price: "399",
    value: PLANS.enterprise,
    isDicount: true,
    discount: "15%",
    image: <StandardPlanImage />
  },
];
/*
 * compoent to render the plan
 */
const AddPlan = React.memo(() => {
  const [currentPlan, setcurrentPlan] = useState(PLANS.basic);
  const form1 = useStore((state: any) => state?.compData?.['form1']) ?? [];
  const { setDataById }: any = useStore();
  const navigate = useNavigate();
  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    setcurrentPlan(event.target.value);
  };
  /*
   * get state data if selected plan data is there
   */
  useEffect(() => {
    setDataById('register', { data: 'PLAN_PAGE', step: 1 });
    if (form1?.field_values) {
      setcurrentPlan(form1?.field_values?.header)
    }
  }, [])

  /*
   * function to change the state and store selected plan
   */
  const handleClick = () => {
    const planDetail = plans.find((item) => item.header === currentPlan);
    setDataById('register', { data: 'CREATE_ACCOUNT_PAGE' });
    setDataById('form1', { field_values: planDetail });
  }
  /*
 * function to handle view plan details
 */
  const handleViewPlanDetails=()=>{
    navigate(routes.pricing());
  }

  return (
    <Grid>
      <Grid container spacing={5}>
      <Grid  className="left-content-wrapper">
        <Grid className="left-inner-content">
          <FormControl className="w-full">
            <Grid alignSelf={"center"}>
              <Typography className="left-plan-text" textAlign={"center"} variant="h2" lineHeight={2} >Choose Plan</Typography>
              <Typography className="left-description-text" textAlign={"center"} variant="h6">Everything you might need and then some more in an accessible and intuitive package.</Typography>
            </Grid>
            <RadioGroup
              className="space-y-[1rem]"
              value={currentPlan}
              onChange={handleChangePlan}
            >
              {plans.map((plan) => (
                <PlanCard
                  image={plan.image}
                  isActive={currentPlan === plan.value}
                  key={plan.value}
                  value={plan.value}
                  header={plan.header}
                  price={plan.price}
                  discount={plan.discount}
                  isDicount={plan.isDicount}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Grid alignSelf={"flex-end"} onClick={handleViewPlanDetails}>
          <Typography  className="cursor-container" variant="h5" mb={3}>View Pricing details?</Typography>
          </Grid>
          <Grid container mb={2} className="w-full" >
          <CustomButton
            className="plan-choose-btn"
            onClick={handleClick}
            label="Choose Plan →"
            variant="contained"
            color="primary"
            size="large"
          />
          </Grid>
        </Grid>
      </Grid>
      </Grid>

   
     
    </Grid>
  )
});

export default AddPlan;