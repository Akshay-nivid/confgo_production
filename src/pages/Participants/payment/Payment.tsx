import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SubmitHandler, useForm } from 'react-hook-form';
import PayPalComponent from '@/pages/register/PayPalCompoent';
import { PaymentMethod } from '@/assets/png';
import { CouponIconColored } from '@/assets/svg';
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
    <Grid container size={12}  className="payment" justifyContent={'center'} alignItems={'center'} >
      <Box  className="payment-content w-full">
      <Box className="header-content-wrapper">
      <Typography textAlign={'center'} className="header-title">
              Payment Method
            </Typography>
            <Box className="payment-method-image">
              <img src={PaymentMethod} alt="payment-method" />
            </Box>
            <PayPalComponent />
      </Box>
      <Box className="form-wrapper">
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
              <Grid container columnSpacing={2}>
                <Grid size={7}>
                  <CustomTextField
                    control={control}
                    className="coupon-textfield"
                    name="coupon"
                label="Apply Coupon Code"
                placeholder="Enter Coupon Code"
                  />
                </Grid>
                <Grid size={5}>
              <CustomButton
                startIcon={<CouponIconColored className='coupon-icon'/>}
                    type="submit"
                    className="coupon-button"
                    size="large"
                    label="Apply Coupon"
                  />
                </Grid>
              </Grid>
            </form>
      </Box>
      <Box className="button-wrapper w-full">
      <CustomButton
              type="submit"
              className="payment-button"
              size="large"
              label="pay $99"
            />
      </Box>
      </Box>
    </Grid>
    // <Grid container className="payment-main flex flex-col justify-center items-center" >
    //       <Grid size={12} className=" header-content-wrapper">
            // <Typography textAlign={'center'} className="header-title">
            //   Payment Method
            // </Typography>
            // <Box className="payment-method-image">
            //   <img src={PaymentMethod} alt="payment-method" />
            // </Box>
            // <PayPalComponent />
    //       </Grid>
    //       <Grid size={12} className="form-wrapper">
            // <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
            //   <Grid container columnSpacing={2}>
            //     <Grid size={7}>
            //       <CustomTextField
            //         control={control}
            //         className="coupon-textfield"
            //         name="coupon"
            //     label="Apply Coupon Code"
            //     placeholder="Enter Coupon Code"
            //       />
            //     </Grid>
            //     <Grid size={5}>
            //   <CustomButton
            //     startIcon={<CouponIconColored className='coupon-icon'/>}
            //         type="submit"
            //         className="coupon-button"
            //         size="large"
            //         label="Apply Coupon"
            //       />
            //     </Grid>
            //   </Grid>
            // </form>
    //       </Grid>
    //       <Grid size={12} className="button-wrapper">
            // <CustomButton
            //   type="submit"
            //   className="payment-button"
            //   size="large"
            //   label="pay $99"
            // />
    //       </Grid>
    //     </Grid>
     
  );
};

export default UserLogin;


