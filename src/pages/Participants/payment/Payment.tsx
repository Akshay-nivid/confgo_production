import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import {  } from 'react-router-dom';
import CustomStepper from '@/components/CustomStepper/CustomStepper';
import PayPalComponent from '@/pages/Register/PayPalCompoent';
import { PaymentMethod } from '@/assets/png';
import clsx from 'clsx';
/**
 * participant user login component
 */
const UserLogin = () => {
  const formData = {
    coupon: '',
  };

  /**
   * react hook form instance
   */
  const { control, handleSubmit } = useForm({
    defaultValues: formData,
  });

  /**
   * function used to handle form submission
   */
  const onSubmit: SubmitHandler<typeof formData> = (data) => {
    console.log(data);
  };

  return (
    <Grid className="user-payment layout" container>
      <Grid container size={6} className="grid-left">
          <Stepper/>
      </Grid>
      <Grid
        container
        size={6}
        className="grid-right  flex justify-center items-center"
      >
        <Grid size={12} className=" right-content-wrapper">
          <Box className=" header-content-wrapper">
            <Typography textAlign={'center'} className="header-title">
              Payment Method
            </Typography>
            <Box className="payment-method-image">
              <img src={PaymentMethod} alt="payment-method" />
            </Box>
            <PayPalComponent />
          </Box>
          <Grid size={12} className="form-wrapper">
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
              <Grid container columnSpacing={2}>
                <Grid size={7}>
                  <CustomTextField
                    control={control}
                    className="coupon-textfield"
                    name="coupon"
                    label="Apply Coupon Code"
                  />
                </Grid>
                <Grid size={5}>
                  <CustomButton
                    type="submit"
                    className="login-button"
                    size="large"
                    label="Apply Coupon"
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid size={12} className="button-wrapper">
            <CustomButton
              type="submit"
              className="payment-button"
              size="large"
              label="pay $99"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserLogin;


const Stepper=()=>{
  return(
    <Box className='w-full'>
      {/* <Grid container>
        {
          Array(3).fill(null).map((_, index) => (
            <>
              <Grid size={4} key={index} className={clsx(index===0 && 'bg-red-200', index===1 && 'bg-green-200', index===2 && 'bg-blue-200')} >
                <Typography className='text-start'>
                Current step
                  
              </Typography>
              </Grid>
            </>
          ))
        }
      </Grid> */}
      <Grid container bgcolor={'lightblue'}  margin={'auto'}>
        {
          Array(3).fill(null).map((_, index) => (
            <>
              <Grid  className={clsx(index === 0 && 'bg-red-500', index === 1 && 'bg-green-500', index === 2 && 'bg-blue-500')} size={4} key={index} display={'flex'} alignItems={'center'}>
                <Box className='relative py-7'>
                  <Box className='absolute top-0 -left-[25px]'>
                  <Typography className=''>steppernamehjgasjdgja</Typography>
                  </Box>
                  <Box className="h-5 w-5 rounded-full bg-white"></Box>
                </Box>
                {index<2 && <Box className="h-1 w-full bg-white"></Box>}
              </Grid>
            </>
          ))
        }
     </Grid>
    </Box>
  )
}