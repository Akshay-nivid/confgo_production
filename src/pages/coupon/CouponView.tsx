import React, { useEffect, useState } from 'react';
import { Box, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams } from 'react-router-dom';
import apiClient from '@/Libs/Https/API-client';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import { useForm } from 'react-hook-form';
import CustomDatePicker from '@/components/CustomDatePicker/CustomDatePicker';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';



/**
 * Coupon Details Page
 * @author Neethu
 */
const CouponView: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Retrieve the ID from URL parameters
  const [coupon, setCoupon] = useState<Coupon | null>(null); // Replace 'Coupon' with your actual coupon type
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error message

  // Define your coupon type for better type safety
  interface Coupon {
    name: string;
    description: string;
    code: string;
    startDate: string; // You may want to use Date type
    endDate: string; // You may want to use Date type
    discountType: string;
    discountValue: number;
    maxUses: number;
    maxDiscountValue: number;
    minPurchaseValue: number;
  }


  const { control, handleSubmit, reset } = useForm();
  /** 
   * useEffect hook to handle the API call 
   */
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/coupon/${id}`); // Adjust the endpoint as needed

        const { status, data, message } = await processAPIResponse(response, "Viewcoupon");
        if (status) {
          setCoupon(data);
        }
      } catch (err) {
        setError('Failed to fetch coupon details.'); // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  // Snackbar for displaying errors
  const handleCloseSnackbar = () => {
    setError(null);
  };
  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'flat', label: 'Flat Rate' },
  ];
  return (
    <>
      <Box className="create-coupon-container">
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        ) : (

          <Grid container size={{ xs: 12, sm: 12 }} justifyContent='center' alignItems='center' spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }} className="create-coupon-grid">
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography textAlign={'center'} lineHeight={2} className='create-coupon-title'>
                  Coupon
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} className="create-coupon-form">
                <form>
                  <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name='name'
                        placeholder='Coupon Name'
                        control={control}
                        defaultValue={coupon?.name}
                        requiredField
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name='code'
                        placeholder='Coupon Code'
                        control={control}
                        defaultValue={coupon?.code}
                        rules={{ required: 'Coupon Code is required' }}
                        requiredField
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomSelect
                        name='discountType'
                        label='Discount Type'
                        defaultValue={coupon?.discountType}
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
                        defaultValue={coupon?.discountValue}
                        requiredField
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomDatePicker
                        placeholder='Start Date'
                        name='startDate'
                        control={control}
                        defaultValue={coupon?.startDate}
                        rules={{ required: 'Start Date is required' }}
                        label='Start Date'
                        requiredField
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomDatePicker
                        defaultValue={coupon?.endDate}
                        placeholder='Expiry Date'
                        name='endDate'
                        control={control}
                        rules={{ required: 'Expiry Date is required' }}
                        label='End Date'
                        requiredField
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name='maxUses'
                        placeholder='Maximum Usage'
                        control={control}
                        type='number'
                        defaultValue={coupon?.maxUses}
                        requiredField
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name='maxDiscountValue'
                        placeholder='Maximum Discount Amount'
                        control={control}
                        defaultValue={coupon?.maxDiscountValue}
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
                        defaultValue={coupon?.minPurchaseValue}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomTextField
                        name='description'
                        multiline={true}
                        rows={4}
                        defaultValue={coupon?.description}
                        placeholder='Description'
                        control={control}
                      />
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>

    </>
  );
};

export default CouponView;
