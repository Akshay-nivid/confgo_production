import React, { useEffect, useState } from 'react';
import {Typography } from '@mui/material';
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
import { setDataById, setNonPersistedDataById } from '@/Libs/store';
import { validateAmount, validateMaxLength, validateMinLength } from '@/Utils/Validation';
import {DrawerClose } from '@/assets/svg';

interface EditCouponProps {
  data?: any;
}
interface CouponFormData {
  name: string;
  code: string;
  startDate: string;
  endDate?: string;
  discountType: 'percentage' | 'flat';
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
const CreateCoupon: React.FC<EditCouponProps> = ({data}) => {
  const [originalData] = useState(data);
  const { control, handleSubmit, reset, watch, setValue, clearErrors, } = useForm<CouponFormData>({
    defaultValues: {
      code: originalData?.code ||'',
      name: originalData?.name || '',
      startDate:originalData?.startDate?.split("T")[0] || '',
      endDate:originalData?.endDate?.split("T")[0] || '',
      discountType: originalData?.discountType ||'percentage',
      discountValue:originalData?.discountValue || '',
      maxUses: originalData?.maxUses ||'',
      maxDiscountValue:originalData?.maxDiscountValue || '',
      minPurchaseValue:originalData?.minPurchaseValue || '',
      description: originalData?.description ||'',
    },
  });
  const isEdit =originalData?.id ? true : false || false;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const discountType = watch('discountType');
  const discountValue = watch('discountValue');

  /**
   * Update maxDiscountValue as discountValue if discountType is flat.
   */
  useEffect(() => {
    if (discountType === 'flat') {
      setValue('maxDiscountValue', discountValue);
    }
  }, [discountType, discountValue, setValue]);

  /**
   * useEffect to clear validation errors for fields when the discountType changes.
   */
  useEffect(() => {
    clearErrors(['discountValue', 'maxDiscountValue','minPurchaseValue']);
  }, [discountType, clearErrors]);

  /**
   * Function to validate the discountValue field based on the discountType.
   * @param value 
   * @param discountType 
   * @returns an error message if validation fails or true if valid.
   */
  const validateDiscountValue = (value: string | undefined, discountType: string | undefined) => {
    if (!value) return "";
    const parsedValue = parseFloat(value);
    if (discountType === "percentage") {
      if (isNaN(parsedValue) || parsedValue > 100) {
        return "Discount percentage cannot exceed 100.";
      }
    } else if (discountType === "flat") {
      if (isNaN(parsedValue)) {
        return "Discount value must be a valid number.";
      }
      setValue("maxDiscountValue", value);
    }
    return true;
  };

  //on submit of create
  const onSubmit = async (data: CouponFormData) => {
    setLoading(true);
    try {
      const apiHeader = isEdit ? `coupon/${originalData?.id}` : 'coupon';
      const req = { ...data, statusId: 1, ...(isEdit ? {} : { companyId: 1 }) };
      const response = isEdit ? await apiClient.put(apiHeader, req) : await apiClient.post(apiHeader, req);

      const { status,message } = await processAPIResponse(response, "createCoupon");
      if (status) {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "success",
          message: isEdit ? "Coupon Updated Successfully" :"Coupon Created Successfully",
        });
        setNonPersistedDataById('craeteCouponDrawer', { value: false })
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

  /**
   * Handle close create coupon drawer close
   */
  const closeDrawer = () => {
     setNonPersistedDataById('craeteCouponDrawer', { value: false })
  }


  return (

    <Grid className="create-coupon-container">
 
      <Grid container size={12} justifyContent='center' alignItems='center' spacing={4} >
        <Grid size={{ xs: 12, sm: 10 }} className="create-coupon-grid">

          <Grid size={{ xs: 12, sm: 12 }} container>
            <Grid container size={10}>

              <Typography textAlign={'center'} lineHeight={2} className='create-coupon-title'>
                {isEdit ? 'Edit Coupon' :'Create New Coupon'}
              </Typography>

            </Grid>

            <Grid size={2} justifyContent={"flex-end"}  container className='create-coupon-title-DrawerClose' >

              <DrawerClose onClick={closeDrawer}/>

            </Grid>

          </Grid>
          <Grid size={12} className="create-coupon-form">
            <form onSubmit={handleSubmit(onSubmit)} >
              <Grid container spacing={2} alignItems={'center'} justifyContent={'center'}>
                {/* Coupon fields */}
                <Grid size={{ xs: 12, sm: 6,lg:12}}>
                  <CustomTextField
                    name='name'
                    placeholder='Coupon Name'
                    control={control}
                    rules={{required:{value:true,message:""}}}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 ,lg:12}}>
                  <CustomTextField
                    name='code'
                    placeholder='Coupon Code'
                    control={control}
                    rules={{
                      required:{value:true,message:""},
                      minLength: validateMinLength({minLength: 6, fieldName: "Coupon Code"}),
                      maxLength: validateMaxLength({maxLength: 8, fieldName: "Coupon Code"}),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 ,lg:12}}>
                  <CustomSelect
                    name='discountType'
                    label='Discount Type'
                    // defaultValue=""
                    control={control}
                    options={discountTypeOptions}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 ,lg:12}}>
                  <CustomTextField
                    name='discountValue'
                    placeholder='Discount Value'
                    control={control}
                    rules={{
                      pattern: validateAmount({}),
                      validate: (value) => validateDiscountValue(value, watch("discountType")),
                    }}
                    type='number'
                    requiredField
                  />
                </Grid>    
                <Grid size={{ xs: 12, sm: 6}}>
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

                <Grid size={{ xs: 12, sm: 6}}>
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
                <Grid size={{ xs: 12, sm: 6 ,lg:12}}>
                  <CustomTextField
                    name='maxUses'
                    placeholder='Maximum Usage'
                    control={control}
                    type='number'
                    rules={{required:{value:true,message:""}}
                          }
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6}}>
                  <CustomTextField
                    name='maxDiscountValue'
                    placeholder='Maximum Discount Amount'
                    control={control}
                    type='number'
                    rules={{
                        required:{value:true,message:""},
                        pattern: validateAmount({})
                    }}
                    readOnly= {discountType === "flat"}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6}}>
                  <CustomTextField
                    name='minPurchaseValue'
                    placeholder='Minimum Purchase Amount'
                    control={control}
                    type='number'
                    rules={{
                      required:{value:true,message:""},
                      pattern: validateAmount({}),
                      ...(watch('discountType') === 'flat' && {
                        min: {
                          value: watch('discountValue'),
                          message: "Min Purchase Value should not be less than Discount Value for flat rate discounts."
                        },
                      }),
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12,lg:12 }}>
                  <CustomTextField
                    name='description'
                    multiline={true}
                    rows={4}
                    placeholder='Description'
                    control={control}
                  />
                </Grid>
                <Grid container size={{ xs: 12, sm: 6 ,lg:12}} justifyContent='center' alignItems='center' spacing={4}>
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

    </Grid>
  );
};

export default CreateCoupon;
