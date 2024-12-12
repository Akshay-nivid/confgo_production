import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Backdrop, Box, Chip, CircularProgress, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { CouponIcon } from "@/assets/svg";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import useStore, { clearDataById, GET, IStoreState, POST } from "@/Libs/store";
import routes from "@/router/routes";
import { handleGroupData } from "../Program-Selection/programsHandlers";
import { processFormData, formatDate } from "../Program-Selection/programsHandlers";
import { EventRegistrationSuccessIcon } from "@/assets/svg";
import CloseIcon from '@mui/icons-material/Close';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Compoennt used to render selected program
 */
const SelectedPrograms = () => {


  const navigate = useNavigate();
  const location = useLocation()


  const selectedPrograms = useStore((state: IStoreState) => state?.compData?.["formatedCartData"]?.["formatedData"]) ?? null;

  const setDataById = useStore((state: IStoreState) => state.setDataById);

  const couponData = useStore((state: IStoreState) => state?.compData?.couponData?.['coupon/applyCoupon']) ?? null
  const cartInfo = useStore((state: any) => state?.compData?.addToCart)

  const eventId = useStore((state: IStoreState) => state?.compData?.["eventSelected"]?.id) ?? null;
  const cartId = cartInfo?.cart.data?.id ?? null
  const participantTypeId = useStore((state: any) => state?.compData?.["participantTypeId"]?.value) ?? '';

  const cartData = useStore((state) => state.compData?.getCart?.[`cart/${cartId}`]) ?? null



  const finalPrice = useStore((state: IStoreState) => state?.compData?.["finalPrice"]?.value) ?? null

  const orderLoading = useStore((state: IStoreState) => state?.compData?.["order"]?.order?.loading)
  const addToCartLoading = useStore((state: IStoreState) => state?.compData?.addToCart?.cart?.loading) ?? false
  const removeCouponLoading = useStore((state: IStoreState) => state.compData?.couponData?.["coupon/applyCoupon"]?.loading) ?? false


  const templateId = useStore((state: IStoreState) => state?.compData?.["templateId"]?.id)
  const classNamePrefix = `selected-programs-main-${templateId}`


  const selectedFormValues = useStore((state: IStoreState) => state?.compData?.["defaultProgramData"]?.formData)
  const { control, setValue, getValues, watch, reset } = useForm({

    defaultValues: {
      ...selectedFormValues,
      coupon: undefined,
    }

  });


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

    const couponCode = getValues("coupon")

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

        setValue('coupon', '')

        setDataById('finalPrice', { value: couponResponse?.data?.total })

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: 'Coupon applied successfully' })

      },
      errorCB: (error: any) => {

        setValue('coupon', '')

        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: error?.message })

      }
    })
  }




  /**
   * Handles the submission of the selected programs form by making an API call to create an order.
   * If a coupon code is present, it is included in the request body.
   * If the order is created successfully, the user is redirected to either the payment method or dynamic user form page.
   * If the order creation fails, an error message is displayed to the user.
   * If the user is not logged in, the user is redirected to the login page and the current route is stored in the session storage.
   */
  function handleClickNextButton() {


    const token = sessionStorage.getItem("token")
    if (!token) {

      navigate(routes.userLogin())
      setDataById('previousRoute', { url: location })

    }


    const body = couponData?.data?.coupon?.code ? {
      coupon: couponData?.data?.coupon?.code,
      cartId: cartId
    } : {
      cartId: cartId
    }

    POST({
      url: "order", id: "order", body: body, successCB: () => {


        GET({
          /**
           * Callback function to handle the response from the dynamic form API.
           * Navigates to the payment method page if no dynamic form data is returned.
           * Otherwise, it parses the metadata from each form item, stores the parsed
           * data, and navigates to the dynamic user form page.
           * 
           * @param dynamicFormResponseData - Response data containing dynamic form information.
           */
          url: `event/form/${eventId}`, id: "dynamicFormData", successCB: (dynamicFormResponseData: any) => {

            if (dynamicFormResponseData.data.length === 0) {
              navigate(routes.userPaymentMethod())
              return
            }

            else {
              const parsedData = dynamicFormResponseData.data?.map((item: any) => {
                const metaData = JSON.parse(item.metadata);
                return {
                  ...item,
                  metadata: metaData,
                };
              });

              setDataById("dynamicFormData", { data: parsedData });

              setDataById("previousRoute", { url: routes.selectedPrograms() });
              navigate(routes.dynamicUserForm())

              return
            }
          }
        })


      }, errorCB: () => { }
    })


  }

  /**
   * method to handle checkbox toggle, updates the form data and makes a call to edit cart api
   * if no program is selected, it navigates to program selection page
   * if program is selected, it makes a call to get cart api after updating the cart
   * and then navigates to user payment method page
   * @param key 
   */
  function onCheckboxToggle() {

    const formData = getValues()

    setDataById('defaultProgramData', { formData: formData })

    const body = processFormData(formData, eventId, participantTypeId)

    if (body.programIds.length === 0) {

      setDataById("formatedCartData", { formatedData: null })

      navigate(routes.programSelection())

      return;
    }

    handleAddAndGetCart(body, formData)

  }

  /**
   * Handles the toggle event of an addon checkbox.
   * 
   * This function is called when an addon checkbox is toggled. It parses the key to extract the date and id components.
   * It then resets the value of the corresponding addon property in the form to an empty array.
   * Afterward, it processes the updated form data, updates the cart, and stores the default program data.
   * 
   * @param key - The key of the checkbox in the format "date-addon-addonId".
   */
  function onAddonCheckboxToggle(key: string) {

    if (key.includes("addon")) {

      const [date, _, id] = key.split("-")

      setValue(`${date}-addonProp-${id}`, [])

    }

    const formData = getValues()
    const body = processFormData(formData, eventId, participantTypeId)

    handleAddAndGetCart(body, formData)
    setDataById('defaultProgramData', { formData: formData })

  }

  /**
   * Makes a call to edit cart API and then gets the cart data.
   * If the request is successful, it formats the data and stores it in the state.
   * If the request fails, it shows an error message on the screen.
   * @param body - Cart body data
   * @param formData - Form data
   */
  function handleAddAndGetCart(body: any, formData: any) {
    POST({
      url: 'cart',
      body: body,
      id: 'addToCart',

      successCB: () => {
        GET({
          url: `cart/${cartId}`,
          id: 'getCart',
          successCB: (response: any) => {

            setDataById("finalPrice", { value: response?.data?.cart?.finalPrice })

            const formatedData = handleGroupData({
              addons: response?.data?.addons,
              programs: response?.data?.programs,
              calculateTotal: true
            })

            setDataById("formatedCartData", { formatedData: formatedData })

            setTimeout(() => {
              reset(formData) // storing form datato set default value
            }, 1)

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


  if (addToCartLoading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }


  if (!cartId) {

    return <Navigate to={routes.userLogin()} />
  }

  console.log(cartData, 'cartData')

  return (
    <Grid container className={`selected-programs-main ${classNamePrefix}`}>

      <Grid size={12} container className="selected-program-wrapper">

        <Grid size={12} className="main-header">

          <Typography textAlign={"center"} className="main-header-title ">
            Your Selection and Bill Summary
          </Typography>

          <Typography textAlign={"center"} className="main-header-description">
            Review your selected programs and meals below.
          </Typography>

        </Grid>

        <Grid
          size={12}
          display={"flex"}
          flexDirection={"column"}
          rowGap={5}
          className="selected-program-card"
          container
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

                      <Grid display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} className="select-program-text card-header-wrapper ">

                        <Box className="program-date-container">
                          <Typography className="card-header">
                            Day {index + 1} - {moment(date).format("MMM DD, YYYY")}
                          </Typography>
                        </Box>

                        <Typography className="card-header">Program</Typography>

                      </Grid>

                      {data?.programs?.length > 0 && data?.programs?.map((item: any) => {

                        return (
                          <Grid key={item?.id} columnSpacing={1} size={12} container className="program-list-container">

                            <Grid size={12} container justifyContent={'space-between'}>

                              <Grid className="time-chip-container" size={12} width={"max-content"}>
                                <Chip className="time-chip" size="medium" icon={<TimerOutlinedIcon />} label={moment(item?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(item?.endTime).format("h:mm A")} />
                              </Grid>

                              <Grid className="program-price">
                                <Chip className="price-chip" size="medium" icon={<AttachMoneyOutlinedIcon />} label={Math.trunc(item?.amount) === 0 ? "free" : `${item?.amount}`} />
                              </Grid>

                            </Grid>

                            <Grid size={9} className="program-name">{item.name}</Grid>

                            <Grid size={12}  >
                              <Typography className="program-description">
                                {item.description}
                              </Typography>
                            </Grid>


                            <Grid size={12}>

                            </Grid>
                            <Grid className="checkbox-container">
                              <CustomCheckbox

                                onChange={() => onCheckboxToggle()}
                                control={control}
                                className="cart-checkbox"
                                id="program"
                                name={`${formatDate(date)}-programs`}
                                setValue={setValue}
                                options={[
                                  { label: '', value: item?.id },
                                ]}
                              />
                              <Typography className="add-text">{watch(`${formatDate(date)}-programs`)?.includes(item?.id) ? <> Remove <DeleteIcon /> </> : <> Add <AddIcon /> </>}</Typography>

                            </Grid>

                          </Grid>
                        )
                      })}
                      {data?.addons?.length > 0 && (

                        <Grid container rowSpacing={2} size={12} direction={'row'} className="add-on-list-container">
                          {data.addons && data?.addons?.map((addon: any, index: number) => {

                            const currentAddon = `${formatDate(date)}-addon-${addon?.id}`
                            return (

                              <Grid>
                                {index === 0 && <Grid textAlign={'center'} size={12} className="card-header card-header-wrapper">Addon</Grid>}
                                <Grid className="addon-list-item-wrapper" size={12} container key={addon?.eventAddon?.id}>



                                  <Grid container size={12} key={addon?.eventAddon?.id} className="addon-list-item">


                                    <Grid size={12} container justifyContent={'space-between'}>

                                      <Grid size={12} className="time-chip-container" width={"max-content"}>
                                        <Chip className="time-chip" size="medium" icon={<TimerOutlinedIcon />} label={moment(addon?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(addon?.endTime).format("h:mm A")} />
                                      </Grid>

                                      <Grid className="program-price">
                                        <Chip className="price-chip" size="medium" icon={<AttachMoneyOutlinedIcon />} label={Math.trunc(addon?.amount) === 0 ? "free" : `${addon?.amount}`} />
                                      </Grid>

                                    </Grid>


                                    <Grid size={12} className="addon-name">{addon?.addon?.name}</Grid>

                                    <Grid size={12} >
                                      <Typography className="program-description">
                                        {addon?.addon?.description}
                                      </Typography>
                                    </Grid>



                                    {/* <Grid size={6}>- ${addon?.amount}</Grid> */}
                                  </Grid>

                                  {(addon?.eventAddonProperties[0] !== null && addon?.eventAddonProperties?.length > 0) && <Grid className='card-sub-header mt_2 mb_1'>Addon Prop :</Grid>}


                                  {addon?.eventAddonProperties?.length > 0 && (
                                    <Grid container size={12} columnSpacing={2} className="add-on-prop-checkbox ">

                                      {addon?.eventAddonProperties.map((property: any) => {

                                        return property !== null && (

                                          <Grid display={'flex'} alignItems={'center'} size={4} className='addon-property-item'>
                                            < CustomCheckbox
                                              className="add-on-property"
                                              key={property?.id}
                                              disabled={watch(currentAddon) === undefined || watch(currentAddon).length === 0}
                                              row={true}
                                              onChange={() => onCheckboxToggle()}
                                              control={control}
                                              // required={false}
                                              name={`${formatDate(date)}-addonProp-${addon?.id}`}
                                              options={[
                                                { label: '', value: property?.id },
                                              ]}
                                            />
                                            <Typography className="add-on-property-name">{property?.name}-{property?.amount}</Typography>
                                          </Grid>

                                        )


                                      })}
                                    </Grid>


                                  )}
                                  <Grid className="checkbox-container mt_3">
                                    <CustomCheckbox

                                      onChange={() => onAddonCheckboxToggle(`${formatDate(date)}-addon-${addon?.id}`)}
                                      control={control}
                                      className="add-on-list-item-checkbox cart-checkbox "
                                      id={addon?.eventAddon?.id}
                                      name={`${formatDate(date)}-addon-${addon?.id}`}
                                      label={addon?.title}
                                      setValue={setValue}
                                      options={[
                                        {
                                          label: '',
                                          value: addon?.id,
                                        },
                                      ]}
                                    />
                                    <Typography className="add-text">{watch(`${formatDate(date)}-addon-${addon?.id}`)?.includes(addon?.id) ? <> Remove <DeleteIcon /> </> : <> Add <AddIcon /> </>}</Typography>


                                  </Grid>
                                </Grid>
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
          {!couponData?.data?.coupon?.code ?
            <Grid className="coupon-container">

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
                    startIcon={!couponData?.loading ? <CouponIcon className="coupon-icon" /> : <></>}
                    isLoading={couponData?.loading || false}
                  />
                </Grid>

              </Grid>

            </Grid> :


            <Grid display={'flex'} justifyContent={'space-between'} size={12} className="coupon-banner-container  ">


              <Grid display={'flex'} columnGap={2} alignItems={'center'}>
                <EventRegistrationSuccessIcon fontSize={'3.5rem'} />
                <Box>
                  <Typography className="coupon-code">{couponData?.data?.coupon?.code.toUpperCase()} <span className="ml-1">applied</span></Typography>
                  <Typography></Typography>
                </Box>
              </Grid>


              <IconButton onClick={handleRemoveCoupon}>
                {removeCouponLoading ? <CircularProgress size={20} /> : <CloseIcon />}
              </IconButton>

            </Grid>
          }

          <Grid container flexDirection={"column"} className="grand-total-container">

            {couponData?.data?.coupon?.code && <Grid className="mb_2" container flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className="sub-text">Coupon Applied</Typography>
              <Typography className="sub-text">$ {couponData.data?.discountAmount}</Typography>
            </Grid>}

            <Grid container flexDirection={"row"} className="mb_2" justifyContent={"space-between"}>
              <Typography className="sub-text">Event amount</Typography>
              <Typography className="sub-text">$ {cartData?.data?.eventAmount}</Typography>
            </Grid>


            <Grid container flexDirection={"row"} className="mb_2" justifyContent={"space-between"}>
              <Typography className="sub-text">Program amount</Typography>
              <Typography className="sub-text">$ {cartData?.data?.programTotal}</Typography>
            </Grid>

            <Grid container flexDirection={"row"} className="mb_2" justifyContent={"space-between"}>
              <Typography className="sub-text">Addon amount</Typography>
              <Typography className="sub-text">$ {cartData?.data?.addonTotal}</Typography>
            </Grid>

            <Grid className="divider mb_2" ></Grid>

            <Grid container flexDirection={"row"} justifyContent={"space-between"}>
              <Typography className="total-text">Grand Total</Typography>
              <Typography className="total-text">$ {finalPrice}</Typography>
            </Grid>

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
              isLoading={orderLoading || false}
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



