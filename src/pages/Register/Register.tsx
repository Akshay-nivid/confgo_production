import { useState } from "react";
import {
  Box,
  FormControl,
  RadioGroup,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {  useNavigate } from "react-router-dom";
import PlanCard from "@/components/PlanCard";
import BasicPlanImage from '@/assets/svg/basic-plan-icon.svg';
import ProPlanImage from '@/assets/svg/pro-plan.svg';
import StandardPlanImage from '@/assets/svg/standard-plan-icon.svg';
import CustomButton from "@/components/CustomButton/CustomButton";
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
 * Component used to register company for scheduling meting,metups etc
 */
const Register = () => {
  const [currentPlan, setcurrentPlan] = useState(PLANS.basic);

  /*
   * function used  to handle change plan
   */
  const handleChangePlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event, 'getting the event is here>>>>>>')
    setcurrentPlan(event.target.value);
  };

  const navigate = useNavigate();
  // const { handleSubmit, control } = useForm<FormData>();

  // form submission function
  // const onSubmit: SubmitHandler<FormData> = () => { };
  const handleClick = () => {
    const currentPath = window.location.pathname;
    navigate(`${currentPath}/account`, { state: { currentPlan } });
  };
  return (
    <Box className="register-main-container">
      <Grid container className="grid-layout">
        <Grid size={{ xs: 12, sm: 6 }} className="grid-left">
          <Box className="left-content-wrapper">
            <Box className="left-inner-content">
              <FormControl className="w-full">
                <Grid alignSelf={"center"}>
                  <Typography fontWeight={800} textAlign={"center"} variant="h2" lineHeight={2} >Choose Plan</Typography>
                  <Typography textAlign={"center"} variant="h6">Everything you might need and then some more in an accessible and intuitive package.</Typography>
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
              <Typography variant="h5" alignSelf={"flex-end"}>View Pricing details?</Typography>
              {/* <Divider></Divider> */}
              <CustomButton
                className="plan-choose-btn"
                onClick={handleClick}
                label="Choose Plan →"
                variant="contained"
                color="primary"
                size="large"
              />
              <Grid container flexDirection={"row"} spacing={2}>
                <Typography>Already have an account?  </Typography>
                <Typography className="login-label" alignContent={"flex-end"}> Log In</Typography>
              </Grid>
              {/* <Typography className="left-description-text">
                Create your account and take the first step towards seamless
                event management.
              </Typography> */}

            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} className="grid-right">
          <Box height={"100%"} className="right-content-wrapper">
            {/* <Box className="right-header-wrapper">
              <Typography className="header-title">
                Get Started with Us!
              </Typography>
              <Typography className="header-description">
                Create your account and take the first step towards seamless
                event management.
              </Typography>
            </Box>
            <Box className="form-wrapper">
              <form onSubmit={handleSubmit(onSubmit)} className="form">
                <CustomTextField
                  control={control}
                  name="fullName"
                  label="Full Name"
                  type="text"
                />
                <CustomTextField
                  control={control}
                  name="email"
                  label={"Email Address"}
                  type="email"
                />
                <CustomTextField
                  name="password"
                  label={"Password"}
                  type="password"
                  control={control}
                />
                <CustomTextField
                  control={control}
                  name="confirmPassword"
                  label={"Confirm Password"}
                  type="password"
                />
                <Button type="submit" variant="contained" className="w-full ">
                  Submit
                </Button>
              </form>
            </Box>
            <Box>
              <Typography className="already-have-account-link">
                Already have an account?
                <span className="signIn-now-text">
                  {" "}
                  <Link to={routes.login()}>Sign In</Link>{" "}
                </span>
              </Typography>
            </Box>*/}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
