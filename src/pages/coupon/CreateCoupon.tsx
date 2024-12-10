import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useForm } from 'react-hook-form';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import CustomSelect from '@/components/CustomSelectBox/CustomSelect';
import CustomButton from '@/components/CustomButton/CustomButton';
import apiClient from '@/Libs/Https/API-client';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { processAPIResponse } from '@/Utils/CommonBaseClass';
import CustomDatePicker from '@/components/CustomDatePicker/CustomDatePicker';
import moment from 'moment';
import { setDataById } from '@/Libs/store';

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
/**
 * Coupon Create 
 * @author Neethu
 */
const CreateCoupon: React.FC = () => {
  const { control, handleSubmit, reset,watch } = useForm<CouponFormData>({
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
  const navigate = useNavigate();

  //on submit of create
  const onSubmit = async (data: CouponFormData) => {
    setLoading(true);
    try {
      const req = {
        ...data,
        statusId: 1,
        companyId: 1,
      };

      const response = await apiClient.post('coupon', req);
      const { status,message } = await processAPIResponse(response, "createCoupon");
      if (status) {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "success",
          message: "Coupon Created Successfully",
        });
        reset();
        setTimeout(() => {
          navigate(routes.coupon()); // Redirect to the coupon list
        }, 1500);
      } else {
        throw new Error(message|| 'Unexpected error occurred');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while creating the coupon.';
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'flat', label: 'Flat Rate' },
  ];

  const startDate = watch('startDate');
  
  const [minEndDate, setMinEndDate] = useState(moment().format("YYYY-MM-DD"));

  /**
   * Update minEndDate whenever startDate changes
   **/ 
  useEffect(() => {
    if (startDate) {
      setMinEndDate(moment(startDate).format("YYYY-MM-DD"));
    }
  }, [startDate]);


  return (
    <Box className="create-coupon-container">
      <Grid container size={{ xs: 12, sm: 12 }} justifyContent='center' alignItems='center' spacing={4}>
        <Grid size={{ xs: 12, sm: 6 }} className="create-coupon-grid">
          <Grid size={{ xs: 12, sm: 12 }}>
            <Typography textAlign={'center'} lineHeight={2} className='create-coupon-title'>
              Create New Coupon
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 12 }} className="create-coupon-form">
            <form onSubmit={handleSubmit(onSubmit)} >
              <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                {/* Coupon fields */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='name'
                    placeholder='Coupon Name'
                    control={control}
                    rules={{required:{value:true,message:""}}}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='code'
                    placeholder='Coupon Code'
                    control={control}
                    rules={{required:{value:true,message:""}}}
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
                    rules={{required:{value:true,message:""},
                            pattern:{value:/^\d+$/,message: "Discount Value must be a positive number."}}
                    }
                    type='number'
                    requiredField
                  />
                </Grid>    
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomDatePicker
                    placeholder='Start Date'
                    name='startDate'
                    control={control}
                    //rules={{required:{value:true,message:""}}}
                    min={moment().format("YYYY-MM-DD")}
                    defaultValue={moment().format("YYYY-MM-DD")}
                    label='Start Date'
                    requiredField
                    rules={{
                      pattern: {
                        value: /^\d{4}-\d{2}-\d{2}$/, 
                        message: "Please enter a valid start date (DD-MM-YYYY)"
                      },required:{value:true,message:""}
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomDatePicker
                    placeholder='Expiry Date'
                    name='endDate'
                    control={control}
                    min={minEndDate}
                    defaultValue={minEndDate}
                    // rules={{required:{value:true,message:""}}}
                    label='End Date'
                    requiredField
                    rules={{
                      pattern: {
                        value: /^\d{4}-\d{2}-\d{2}$/, 
                        message: "Please enter a valid end date (DD-MM-YYYY)"
                      },required:{value:true,message:""}
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='maxUses'
                    placeholder='Maximum Usage'
                    control={control}
                    type='number'
                    rules={{required:{value:true,message:""}}
                          }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <CustomTextField
                    name='maxDiscountValue'
                    placeholder='Maximum Discount Amount'
                    control={control}
                    type='number'
                    rules={{required:{value:true,message:""}}
                          }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomTextField
                    name='minPurchaseValue'
                    placeholder='Minimum Purchase Amount'
                    control={control}
                    type='number'
                    rules={{required:{value:true,message:""}}
                          }
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
