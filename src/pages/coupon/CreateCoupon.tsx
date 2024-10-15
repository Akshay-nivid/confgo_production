import React, { useState } from 'react';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';
import CustomButton from '@/components/CustomButton/CustomButton';
import apiClient from '@/Libs/Https/API-client';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';

interface CouponFormData {
  name: string;
  code: string;
  startDate: string;
  endDate?: string;
  discountType: '';
  discountValue: string;
  maxUses: string;
  maxDiscountValue: string;
  minPurchaseValue: string;
  description?: string;
  type?: string;
}

const CreateCoupon: React.FC = () => {
  const { control, handleSubmit, reset } = useForm<CouponFormData>({
    defaultValues: {
      code: '',
      name: '',
      startDate: '',
      endDate: '',
      discountType: '',
      discountValue: '',
      maxUses: '',
      maxDiscountValue: '',
      minPurchaseValue: '',
      description: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  
  const onSubmit = async (data: CouponFormData) => {
    setLoading(true);
    try {
      const req = {
        ...data,
        status:1,
        timesUsed: 0,
        companyId: 1,
      };

      const response = await apiClient.post('coupon', req);

      if (response.status === 201 && response.data.status === 'success') {
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity('success');
        reset();
        setTimeout(() => {
          navigate(routes.coupon()); // Redirect to the coupon list
      }, 1500); 
      } else {
        throw new Error(response.data.message || 'Unexpected error occurred');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while creating the coupon.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'flat', label: 'Flat Rate' },
  ];

  return (
    <Box className="create-coupon-container">
       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Grid container size={{ xs: 12, sm: 12 }} justifyContent='center' alignItems='center' spacing={4}>
        <Grid size={{ xs: 12, sm: 6 }} className="create-coupon-grid">
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography textAlign={'center'} lineHeight={2} className='create-coupon-title'>
              Create New Coupon
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} className="create-coupon-form">
            <form onSubmit={handleSubmit(onSubmit)} >
              <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                {/* Coupon fields */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='name'
                    placeholder='Coupon Name'
                    control={control}             
                    rules={{ required: 'Coupon Name is required' }}
                    requiredField
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='code'
                    placeholder='Coupon Code'
                    control={control}
                    rules={{ required: 'Coupon Code is required' }}
                    requiredField
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomSelect
                    name='discountType'
                    label='Discount Type'
                   // defaultValue=""
                    control={control}
                    options={discountTypeOptions}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='discountValue'
                    placeholder='Discount Value'
                    control={control}
                    rules={{ required: 'Discount Value is required' }}
                    type='number'
                    requiredField
                  />
                </Grid>    
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    placeholder='Start Date'
                    name='startDate'
                    control={control}
                    rules={{ required: 'Start Date is required' }}
                    type='date'
                    requiredField
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='endDate'
                    control={control}
                    type='date'
                    requiredField
                    rules={{ required: 'Expiry Date is required' }}
                    placeholder='Expiry Date'
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='maxUses'
                    placeholder='Maximum Usage'
                    control={control}
                    type='number'
                    requiredField
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='maxDiscountValue'
                    placeholder='Maximum Discount Amount'
                    control={control}
                    type='number'
                    requiredField
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomTextField
                    name='minPurchaseValue'
                    placeholder='Minimum Purchase Amount'
                    control={control}
                    type='number'
                    requiredField
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomTextField
                    name='description'
                    multiline={true}
                    rows={4} 
                    placeholder='Description'
                    control={control}
                  />
                </Grid>
                <Grid container size={{ xs: 12, sm: 6 }} justifyContent='center' alignItems='center' spacing={4}>
                  <Grid  >
                    <CustomButton
                      className="create-coupon-next-btn"
                      label='Submit'
                      variant='contained'
                      color='primary'
                      size='large'
                      type='submit'
                      disabled={loading}
                    />
                  </Grid>
               
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Grid>
     
    </Box>
  );
};

export default CreateCoupon;
