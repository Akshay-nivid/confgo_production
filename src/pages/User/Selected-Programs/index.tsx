import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Backdrop, Box, Chip, CircularProgress, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { CouponIcon } from "@/assets/svg";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import useStore, { GET, POST, PUT } from "@/Libs/store";
import routes from "@/router/routes";
import { handleGroupData } from "../Program-Selection/programsHandlers";
import { processFormData, formatDate } from "../Program-Selection/programsHandlers";
import { EventRegistrationSuccessIcon } from "@/assets/svg";
import CloseIcon from '@mui/icons-material/Close';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

/**
 * Compoennt used to render selected program
 */
const SelectedPrograms = () => {


  const navigate = useNavigate();

  const selectedPrograms = useStore((state: any) => state?.compData?.["formatedCartData"]?.["formatedData"]) ?? null;

  const setDataById = useStore((state: any) => state.setDataById);

  const selectedFormValues = useStore(state => state?.compData?.["defaultProgramData"]?.formData)

  const couponData = useStore((state: any) => state?.compData?.["couponData"]?.['coupon/applyCoupon']) ?? null

  const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id) ?? null;

  const cartInfo = useStore(state => state?.compData?.["addToCart"]) // cart.data.id

  const cartId = cartInfo?.cart.data?.id ?? null

  const orderLoading = useStore((state: any) => state?.compData?.["order"]?.order?.loading)

  const addToCartLoading = useStore((state: any) => state?.compData?.["addToCart"]?.[`cart/${cartId}`]?.loading)

  const participantTypeId = useStore((state: any) => state?.compData?.["participantTypeId"]?.value) ?? null;

  const finalPrice = useStore((state: any) => state?.compData?.["finalPrice"]?.value) ?? null

  const location = useLocation()



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
    setDataById('couponData', { ["coupon/applyCoupon"]: null })
    setDataById('finalPrice', { value: selectedFormValues?.total })
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
    PUT({
      url: `cart/${cartId}`,
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

                      <Grid marginBottom={2} display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} className="select-program-text card-header-wrapper ">

                        <Box className="program-date-container">
                          <Typography className="card-header">
                            Day {index + 1} - {moment(date).format("MMM DD, YYYY")}
                          </Typography>
                        </Box>

                        <Typography className="card-header">Program</Typography>

                      </Grid>

                      {data?.programs?.length > 0 && data?.programs?.map((item: any) => {

                        return (
                          <Grid marginBottom={2} key={item?.id} columnSpacing={1} size={12} container className="program-list-container">

                            <Grid size={12} container justifyContent={'space-between'}>

                              <Grid marginBottom={1} size={12} borderRadius={10} width={"max-content"}>
                                <Chip className="time-chip" size="medium" icon={<TimerOutlinedIcon />} label={moment(item?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(item?.endTime).format("h:mm A")} />
                              </Grid>

                              <Grid className="program-price">
                                <Chip className="price-chip" size="medium" icon={<AttachMoneyOutlinedIcon />} label={`${item?.amount}`} />
                              </Grid>

                            </Grid>

                            <Grid size={9} marginBottom={.5} fontSize={20} fontWeight={500}>{item.name}</Grid>

                            <Grid size={12} fontSize={12} fontWeight={400} >
                              <Typography className="program-description">
                                {item.description}
                              </Typography>
                            </Grid>


                            <Grid size={12}>

                            </Grid>
                            <Grid marginTop={2} className="program-list-item">
                              <CustomCheckbox

                                onChange={() => onCheckboxToggle()}
                                control={control}
                                className="program-list-item"
                                id="program"
                                name={`${formatDate(date)}-programs`}
                                setValue={setValue}
                                options={[
                                  { label: '', value: item?.id },
                                ]}
                              />
                              <Typography className="add-text">{watch(`${formatDate(date)}-programs`)?.includes(item?.id) ? 'Remove' : 'Add'}</Typography>

                            </Grid>

                          </Grid>
                        )
                      })}
                      {data?.addons?.length > 0 && (
                        <Grid container size={12} direction={'row'} className="add-on-list-container">
                          {data.addons && data?.addons?.map((addon: any, index: number) => {

                            const currentAddon = `${formatDate(date)}-addon-${addon?.id}`
                            return (

                              <Grid>
                                {index === 0 && <Grid textAlign={'center'} marginBottom={2} size={12} className="card-header card-header-wrapper">Addon</Grid>}
                                <Grid className="add-on-list-item-wrapper" size={12} container key={addon?.eventAddon?.id}>



                                  <Grid container size={12} key={addon?.eventAddon?.id} className="add-on-list-item">


                                    <Grid size={12} container justifyContent={'space-between'}>

                                      <Grid marginBottom={1} size={12} borderRadius={10} width={"max-content"}>
                                        <Chip className="time-chip" size="medium" icon={<TimerOutlinedIcon />} label={moment(addon?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(addon?.endTime).format("h:mm A")} />
                                      </Grid>

                                      <Grid className="program-price">
                                        <Chip className="price-chip" size="medium" icon={<AttachMoneyOutlinedIcon />} label={`${addon?.amount}`} />
                                      </Grid>

                                    </Grid>


                                    <Grid size={12} marginBottom={.5} fontSize={24} fontWeight={500}>{addon?.addon?.name}</Grid>

                                    <Grid size={12} fontSize={12} fontWeight={400} >
                                      <Typography className="program-description">
                                        {addon?.addon?.description}
                                      </Typography>
                                    </Grid>



                                    {/* <Grid size={6}>- ${addon?.amount}</Grid> */}
                                  </Grid>

                                  {addon?.eventAddonProperties?.length > 0 && <Grid marginTop={2} marginBottom={1} className='card-sub-header'>Addon Prop :</Grid>}

                                  {addon?.eventAddonProperties?.length > 0 && (
                                    <Grid container size={12} columnSpacing={2} paddingBlock={1} className="add-on-prop-checkbox ">

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
                                  <Grid marginTop={3} className="program-list-item">
                                    <CustomCheckbox

                                      onChange={() => onAddonCheckboxToggle(`${formatDate(date)}-addon-${addon?.id}`)}
                                      control={control}
                                      className="add-on-list-item-checkbox "
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
                                    <Typography className="add-text">{watch(`${formatDate(date)}-addon-${addon?.id}`)?.includes(addon?.id) ? 'Remove' : 'Add'}</Typography>


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


            <Grid display={'flex'} justifyContent={'space-between'} size={12} className="coupon-banner-container border border-green-600  rounded-lg p-5 bg-green-50/20 ">


              <Grid display={'flex'} columnGap={2} alignItems={'center'}>
                <EventRegistrationSuccessIcon fontSize={'2.5rem'} />
                <Box>
                  <Typography className="coupon-code">{couponData?.data?.coupon?.code.toUpperCase()} <span className="ml-1">applied</span></Typography>
                  <Typography></Typography>
                </Box>
              </Grid>


              <IconButton onClick={handleRemoveCoupon}>
                <CloseIcon />
              </IconButton>

            </Grid>
          }


          <Grid className="grand-total-container">
            <Typography className="total-text">Grand Total</Typography>
            <Typography className="total-text">${finalPrice}</Typography>
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



