import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { CouponIcon } from "@/assets/svg";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useStore, { GET, POST, PUT } from "@/Libs/store";
import routes from "@/router/routes";
import { handleGroupData } from "../Program-Selection/programsHandlers";
import { processFormData, formatDate } from "../Program-Selection/programsHandlers";
import { EventRegistrationSuccessIcon } from "@/assets/svg";

/**
 * Compoennt used to render selected program
 */
const SelectedPrograms = () => {


  const navigate = useNavigate();
  const cart = useStore((state: any) => state?.compData?.["getCart"]) ?? null;
  const selectedPrograms = useStore((state: any) => state?.compData?.["formatedCartData"]?.["formatedData"]) ?? null;
  const setDataById = useStore((state: any) => state.setDataById);
  const selectedFormValues = useStore(state => state?.compData?.["defaultProgramData"].formData)
  const couponData = useStore((state: any) => state?.compData?.["couponData"]?.context) ?? null
  const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id) ?? null;
  const addToCartResponseData = useStore((state: any) => state?.compData?.["addToCart"]) ?? null;

  const { control, setValue, getValues, reset } = useForm({

    defaultValues: {
      ...selectedFormValues,
      coupon: undefined,
    }

  });

  /**
   * method to handle apply coupon api
   * @returns 
   */
  function handleClickApplyCoupon() {

    const couponCode = getValues("coupon")

    if (!couponCode) {
      return
    }

    const body = {
      code: couponCode,
      cartId: addToCartResponseData?.cart?.data?.id
    }

    /**
     * calling apply coupon api
     */
    POST({
      url: 'coupon/applyCoupon',
      body: body,
      id: 'couponData',
      successCB: () => {

        setValue('coupon', '')

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: 'Coupon applied successfully' })

      },
      errorCB: (error: any) => {

        setValue('coupon', '')

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: error?.message })

      }
    })
  }

  /**
   * function to handle next button click
   */

  function handleClickNextButton() {
    const token = sessionStorage.getItem("token")
    if (!token) {
      navigate(routes.userLogin())
      setDataById('previousRoute', routes.selectedPrograms())
    }

    GET({
      url: `event/form/${eventId}`, id: "dynamicFormData", successCB: (dynamicFormResponseData: any) => {
        console.log(dynamicFormResponseData)
        if (dynamicFormResponseData.data.length === 0) {
        navigate(routes.userPaymentMethod())
        return
      } else {
       navigate(routes.dynamicUserForm())
        return
      }
    }})
  }

  function onCheckboxToggle(key: string) {
    const formData = getValues()
    if (key.includes("addon")) {
      const [date, _, id] = key.split("-")
      formData[`${date}-addonProp-${id}`] = undefined
    }
    setDataById('defaultProgramData', { formData: formData })

    const body = processFormData(formData, eventId)

    if (body.programIds.length === 0) {

      setDataById("formatedCartData", { formatedData: null })

      navigate(routes.programSelection())

      return;
    }
    const cartId = addToCartResponseData?.cart?.data?.id;

    PUT({
      url: `cart/${cartId}`,
      body: body,
      id: 'addToCart',

      successCB: (data: any) => {

        const cartID = cartId ? cartId : data?.data?.id

        GET({
          url: `cart/${cartID}`,
          id: 'getCart',
          successCB: (response: any) => {

            const formatedData = handleGroupData({
              addons: response?.data?.addons,
              programs: response?.data?.programs,
              calculateTotal: true
            })

            setDataById("formatedCartData", { formatedData: formatedData })

            setTimeout(() => {
              reset(formData) // storing form datato set default value
            }, 1)
            // navigate(routes.selectedPrograms());

          },
          errorCB: (error: any) => {
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "error",
              message: error?.message || 'something went wrong',
            })

          }
        })

      },
      errorCB: (error: any) => {

        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: error?.message,
        });

      }
    })
  }


  return (
    <Grid container className="selected-programs-main">
      <Grid size={12} container className="selected-program-wrapper">
        <Grid size={12} className="selected-programs-main-header">
          <Typography textAlign={"center"} className="header-title ">
            Your Selection and Bill Summary
          </Typography>
          <Typography textAlign={"center"} className="header-description">
            Review your selected programs and meals below.
          </Typography>
        </Grid>
        <Grid
          size={12}
          display={"flex"}
          flexDirection={"column"}
          rowGap={5}
          className=""
        >
          {
            selectedPrograms && Object.entries(selectedPrograms).map(([date, data]: any, index: number) =>

            (

              <>
                {Object.keys(data).length !== 0 &&
                  <Grid

                    width={"100%"}
                    key={date}
                    className="selected-program-card-wrapper"
                  >
                    <Grid key={date} className="selected-program-card-content">
                      <Typography className="sub-header">
                        Day {index + 1} -
                        {moment(date).format("MMM DD, YYYY")}
                      </Typography>
                      <Typography className="sub-header">
                        Programs Selected:
                      </Typography>
                      {data?.programs?.length > 0 && data?.programs?.map((item: any) => {
                        return (
                          <Grid key={item?.id} container direction={'row'} className="program-list-container">
                            <Grid>
                              <CustomCheckbox
                                onChange={() => onCheckboxToggle(`${formatDate(date)}-programs`)}
                                control={control}
                                className="program-list-item-checkbox"
                                id="program"
                                name={`${formatDate(date)}-programs`}
                                setValue={setValue}
                                options={[
                                  { label: item?.name, value: item?.id },
                                ]}
                              />
                            </Grid>
                            <Grid size={6} alignItems={'center'} display={'flex'}>- {moment(date).format("h:mm A")} - ${item?.amount}</Grid>
                          </Grid>
                        )
                      })}
                      {data?.addons?.length > 0 && (
                        <Grid container size={12} direction={'row'} className="add-on-list-container">
                          {data.addons && data?.addons?.map((addon: any, index: number) => {
                            return (
                              <Grid key={addon?.eventAddon?.id}>
                                {index === 0 && <Grid className="select-add-on-text">Addon:</Grid>}
                                <Grid key={addon?.eventAddon?.id} className="add-on-list-item">

                                  <CustomCheckbox
                                    onChange={() => onCheckboxToggle(`${formatDate(date)}-addon-${addon?.id}`)}
                                    control={control}
                                    className="add-on-list-item-checkbox "
                                    id={addon?.addonId}
                                    name={`${formatDate(date)}-addon-${addon?.id}`}
                                    label={addon?.title}
                                    setValue={setValue}
                                    options={[
                                      {
                                        label: addon?.addon?.name,
                                        value: addon?.id,
                                      },
                                    ]}
                                  />

                                  <Grid size={6}>- ${addon?.amount}</Grid>
                                </Grid>
                                {addon?.eventAddonProperties?.length > 0 && (
                                  <Grid >

                                    {addon?.eventAddonProperties.map((property: any) => {
                                      return property !== null && (
                                        < CustomCheckbox
                                          // disabled={watch(currentAddon) === undefined || watch(currentAddon).length === 0}
                                          row={true}
                                          control={control}
                                          required={false}
                                          name={`${formatDate(date)}-addonProp-${addon?.id}`}
                                          options={[
                                            { label: property?.name, value: property?.id },
                                          ]}
                                        />)
                                    })}
                                  </Grid>
                                )}
                              </Grid>
                            )
                          })}
                        </Grid>
                      )}
                    </Grid>
                    <Grid className="divider "></Grid>
                    <Grid
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      className="subtotal-container"
                    >
                      <Typography className="total-text">
                        Subtotal for Day {index + 1}
                      </Typography>
                      <Typography className="total-text">
                        $ {selectedPrograms[date].total}
                      </Typography>
                    </Grid>
                  </Grid>}
              </>
            ))
          }
          {!couponData?.data?.coupon?.code ? <Grid className="coupon-container">
            <Typography className="coupon-header-text">
              Apply Coupons
            </Typography>
            <Grid container columnSpacing={3}>
              <Grid size={8}>
                <CustomTextField
                  control={control}
                  name="coupon"
                  placeholder="Apply Coupon Code"
                />
              </Grid>
              <Grid size={4}>
                <CustomButton
                  className="apply-coupon-button"
                  label="Apply Coupon"
                  size="large"
                  variant="outlined"
                  onClick={handleClickApplyCoupon}
                  startIcon={<CouponIcon className="coupon-icon" />}
                />
              </Grid>
            </Grid>
          </Grid> :
            <Grid display={'flex'} justifyContent={'space-between'} size={12} className="coupon-banner-container border border-green-600  rounded-lg p-5 bg-green-50/20 ">
              <Grid display={'flex'} columnGap={2} alignItems={'center'}>

                <EventRegistrationSuccessIcon fontSize={'40px'} />
                <Box>
                  <Typography className="coupon-code">{couponData?.data?.coupon?.code.toUpperCase()} <span className="ml-1">applied</span></Typography>
                  <Typography></Typography>
                </Box>
              </Grid>
              <CustomButton onClick={() => {
                setDataById('couponData', { context: null })
              }} className="error-text" variant="text" label="Remove" />
            </Grid>}
          <Grid className="grand-total-container">
            <Typography className="total-text">Grand Total</Typography>
            <Typography className="total-text">${couponData?.data?.total || addToCartResponseData?.cart?.data?.finalPrice}</Typography>
          </Grid>

          <Grid className="navigation-btn-group-container">
            <CustomButton
              className="back-btn"
              label="Back"
              variant="outlined"
              onClick={() => navigate(routes.programSelection())}
            />
            <CustomButton
              className="next-btn"
              label="Next"
              variant="contained"
              onClick={handleClickNextButton}
            />

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectedPrograms;



