import { Coupon2, EventRegistrationSuccessIcon } from '@/assets/svg'
import CustomButton from '@/components/CustomButton/CustomButton'
import CustomTextField from '@/components/CustomTextfield/CustomTextField'
import useStore, { clearDataById, POST, setDataById } from '@/Libs/store'
import { Box, CircularProgress, IconButton, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useForm } from 'react-hook-form'
import CloseIcon from '@mui/icons-material/Close';

const AddCoupon = () => {

    const form = useForm()
    const removeCouponLoading = useStore((state) => state.compData?.couponData?.['coupon/removeCoupon']?.loading) ?? false
    const cartInfo = useStore((state) => state?.compData?.addToCart)
    const cartId = cartInfo?.cart.data?.id ?? null
    const userToken = sessionStorage.getItem("userToken");
    const couponData = useStore((state) => state?.compData?.couponData?.['coupon/applyCoupon']) ?? null

      /**
   * Resets the coupon data in the store
   */
  function handleRemoveCoupon() {

    POST({
      url: 'coupon/removeCoupon',
      id: 'couponData',
      body: { cartId: cartId },
      successCB: (removeCouponResponse: { data: { finalPrice: number | string }, loading: boolean, success: boolean }) => {

        setDataById('finalPrice', { value: removeCouponResponse?.data?.finalPrice })

        clearDataById("couponData")

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: 'Coupon removed successfully' })
      }

    })

    }
    
     /**
   * method to handle apply coupon api
   * @returns 
   */
  function handleClickApplyCoupon() {

    const couponCode = form.getValues("coupon")

    if (!couponCode) {
      return
    }

    const body = {
      code: couponCode,
      cartId: cartId
    }

    /**
     * calling apply coupon api
     */
    POST({
      url: 'coupon/applyCoupon',
      body: body,
      id: 'couponData',
      successCB: (couponResponse: any) => {

        form.setValue('coupon', '')

        setDataById('finalPrice', { value: couponResponse?.data?.total })

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: 'Coupon applied successfully' })

      },
      errorCB: (error: any) => {

        form.setValue('coupon', '')

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: error?.message })

      }
    })
  }


    return (
        <>
            {userToken &&(

                 !couponData?.data?.coupon?.code ? (
                    <Grid className="coupon-container shadow-app app-border-radius">

                            {/* <Typography className="apply-coupon-header">
                                Apply Coupons
                            </Typography> */}

                        <Grid container rowSpacing={2} columnSpacing={3}>

                            <Grid size={{ xs: 12, md: 8 }}>
                                <CustomTextField
                                    control={form.control}
                                    name="coupon"
                                    // placeholder="Apply Coupon Code"
                                    label='Apply Coupon Code'
                                    placeholder='Enter Coupon Code'
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <CustomButton
                                    className="apply-coupon-button"
                                    label="Apply Coupon"
                                    size="large"
                                
                                    variant="outlined"
                                    onClick={handleClickApplyCoupon}
                                    startIcon={!couponData?.loading ? <Coupon2 className="icon" /> : <></>}
                                    isLoading={couponData?.loading || false}
                                />
                            </Grid>

                        </Grid>

                    </Grid>
                ) : (

                    <Grid display={'flex'} justifyContent={'space-between'} size={12} className="coupon-banner-container shadow-app app-border-radius ">


                        <Grid display={'flex'} columnGap={2} alignItems={'center'}>
                            <EventRegistrationSuccessIcon fontSize={'3.5rem'} />
                            <Box>
                                <Typography className="coupon-code">{couponData?.data?.coupon?.code.toUpperCase()} <span className="ml-1">applied</span></Typography>
                                <Typography></Typography>
                            </Box>
                        </Grid>


                        <IconButton className='min-w-max h-12 w-12' onClick={handleRemoveCoupon}>
                            {removeCouponLoading ? <CircularProgress color='success' size={20} /> : <CloseIcon />}
                        </IconButton>

                    </Grid>
                )
            )}
        </>
    )
}

export default AddCoupon
