import CustomButton from "@/components/CustomButton/CustomButton";
import { Backdrop, Box, Chip, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import useStore, { GET, IStoreState, POST, setNonPersistedDataById, snackBar } from "@/Libs/store";
import routes from "@/router/routes";
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Badge from "../Components/Badge";
import { Dollar } from '@/assets/svg'
import LocalTimeDate from "@/components/LocalTimeDate/LocalTimeDate";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { getUserCart } from "@/pages/events/template/programHandler";
import { handleCartProcessing } from "../Payment-Method/programHandler";
import { useEffect } from "react";
import clsx from "clsx";
import CheckIcon from '@mui/icons-material/Check';
import BillInfo from "./BillInfo";
import AddCoupon from "./AddCoupon";
import useProgramAddonToggle from "../Program-Selection/useProgramAddonToggle";

import { Check } from '@mui/icons-material';
/**
 * Compoennt used to render selected program
 */
const SelectedPrograms = () => {



  const navigate = useNavigate();
  const location = useLocation();


  const selectedPrograms = useStore((state: IStoreState) => state?.compData?.["formatedCartData"]?.["formatedData"]) ?? null;

  const setDataById = useStore((state: IStoreState) => state.setDataById);

  const cartInfo = useStore((state) => state?.compData?.addToCart)

  const eventId = useStore((state: IStoreState) => state?.compData?.["eventSelected"]?.id) ?? null;
  const cartId = cartInfo?.cart.data?.id ?? null
  const participantTypeId = useStore((state) => state?.compData?.["participantTypeId"]?.value) ?? '';




  const finalPrice = useStore((state: IStoreState) => state?.compData?.["finalPrice"]?.value) ?? null

  const orderLoading = useStore((state: IStoreState) => state?.compData?.["order"]?.order?.loading)
  const addToCartLoading = useStore((state: IStoreState) => state?.compData?.addToCart?.cart?.loading) ?? false

  const fetchCartLoading = useStore(state => state.nonPersistedData?.getCartLoading?.value) ?? false

  const templateId = useStore((state: IStoreState) => state?.compData?.["templateId"]?.id)
  const classNamePrefix = `selected-programs-main-${templateId}`
  const couponData = useStore((state: IStoreState) => state?.compData?.couponData?.['coupon/applyCoupon']) ?? null

  const shouldPostCart = useStore((state: IStoreState) => state?.nonPersistedData?.shouldPostCart?.value) ?? false




  const { handleClickAddonProp, isAddonProp, isProgramInCart, isAddonInCart, handleProgramClick, handleAddonClick } = useProgramAddonToggle()

  const cart = useStore((state: IStoreState) => state?.nonPersistedData?.cart)














  /**
   * Navigates to the dynamic user form page
   * @param route - The route to navigate to
   */
  function handleDynamicNavigation(route: string) {

    navigate(route)
  }


  useEffect(() => {

  // this is prevent api call on mount
    if (shouldPostCart === false) {
      setNonPersistedDataById('shouldPostCart', { value: true })
      return
    }

    try {

      const apiBody = {
        eventId: eventId,
        ...((participantTypeId && participantTypeId !== null && participantTypeId !== undefined) ? { participantTypeId: participantTypeId } : {}),
        ...((cart?.programIds && cart?.programIds?.length > 0) ? { programIds: cart.programIds } : {}),
        ...((cart?.addons && cart?.addons?.length > 0) ? { addons: cart.addons } : {})
      }


      POST({
        url: 'cart',
        body: apiBody,
        id: 'addToCart',
        successCB: (context) => {
          getUserCart({
            cartID: context?.data?.id, helperFn: (data) => {

              if (data?.addons?.length === 0 && data?.programs?.length === 0) {
                navigate(routes.programSelection())
              }
            }
          })
        }
      })


    } catch (e) {

    }



  }, [cart?.programIds?.length, cart?.addons])

  /**
   * Handles the submission of the selected programs form by making an API call to create an order.
   * If a coupon code is present, it is included in the request body.
   * If the order is created successfully, the user is redirected to either the payment method or dynamic user form page.
   * If the order creation fails, an error message is displayed to the user.
   * If the user is not logged in, the user is redirected to the login page and the current route is stored in the session storage.
   */
  function handleClickNextButton() {


    const token = sessionStorage.getItem("userId")

    if (!token) {
      setDataById('previousRoute', { url: location.pathname })
      navigate(routes.userLogin())
      return;
    }



    const coupon = couponData?.data?.coupon?.code || null;


    const body = {
      cartId: cartId,
      ...(coupon && { coupon: coupon })

    }

    POST({
      url: "order", id: "order", body: body, successCB: (orderResponse: any) => {


        GET({
          url: `event/form/${eventId}`, id: "dynamicFormData", successCB: (dynamicFormResponseData: any) => {

            if (dynamicFormResponseData.data.length === 0) {

              handleCartProcessing({ helperFn: handleDynamicNavigation, grandTotal: finalPrice, orderId: orderResponse?.data?.id, eventId: eventId })
             
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


      }, errorCB: (err) => {
        snackBar({ severity: 'error', message: err?.message || 'something went wrong' })
      }
    })


  }


  if (addToCartLoading || fetchCartLoading) {
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
    <Grid container className={`selected-programs-main ${classNamePrefix}`}>

      <Grid size={12} container className="selected-program-wrapper">

        <Grid size={12} className="main-header">

          <Typography textAlign={"center"} className="main-header-title ">
            Your Selection and Bill Summary
          </Typography>

          <Typography textAlign={"center"} className="main-header-description">
            Review your selected programs and addons below.
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
                    className="selected-program-card-wrapper shadow"
                  >
                    <Grid key={date} className="selected-program-card-content">

                      <Grid display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} className="select-program-text card-header-wrapper ">

                        <Box className="program-date-container">
                          <Typography className="card-header">
                            Day {index + 1} - {moment(date).format("MMM DD, YYYY")}
                          </Typography>
                        </Box>


                      </Grid>

                      {data?.programs?.length > 0 && data?.programs?.map((item: any) => {

                        return (
                          <Grid key={item?.id} columnSpacing={1} size={12} container className="program-list-container">

                            <Grid size={12} container justifyContent={'space-between'}>

                              <Grid className="time-chip-container" size={12} width={"max-content"}>
                                <Chip className="time-chip" size="medium" icon={<TimerOutlinedIcon />} label={moment(item?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(item?.endTime).format("h:mm A")} />
                              </Grid>
                              <Badge text="Program" type="program" />



                            </Grid>

                            <Grid size={9} className="program-name">{item.name}</Grid>

                            <Grid size={12}  >
                              <Typography className="program-description">
                                {item.description}
                              </Typography>
                            </Grid>

                            <Grid display={'flex'} alignItems={'center'} className="program-price-container">
                              <Dollar className="money-icon" />
                              <Typography className="program-price">{Math.trunc(Number(item?.amount)) === 0 ? "Free" : `${item?.amount}`}</Typography>
                            </Grid>

                            <Grid size={12}>

                            </Grid>
                            <Grid className="checkbox-container">

                              <Grid size={4} className={`selected-program-checkbox-group-${templateId}`}>

                                <CustomButton fullWidth startIcon={isProgramInCart(item?.id) ? <Check className="" /> : null} className={clsx(`selected-program-card-btn-${templateId} selected-program-card-btn`, isProgramInCart(item?.id) && `selected-program-card-btn-${templateId}-active`)} label={isProgramInCart(item?.id) ? "Added" : "Add"} onClick={() => handleProgramClick(item?.id)} />
                              </Grid>

                            </Grid>

                          </Grid>
                        )
                      })}
                      {data?.addons?.length > 0 && (

                        <Grid container rowSpacing={2} size={12} direction={'row'} className="add-on-list-container">
                          {data.addons && data?.addons?.map((addon: any) => {

                            return (

                              <Grid key={addon.id}>
                                <Grid className="addon-list-item-wrapper" size={12} container key={addon?.eventAddon?.id}>



                                  <Grid container size={12} key={addon?.eventAddon?.id} className="addon-list-item">


                                    <Grid size={12} container justifyContent={'space-between'}>

                                      <Box className="addon-name">{addon?.addon?.name}</Box>

                                      <Badge text="Addon-on" type="addon" />




                                    </Grid>



                                    <Grid size={12} >
                                      <Typography className="program-description">
                                        {addon?.addon?.description}
                                      </Typography>
                                    </Grid>

                                    <Box className="flex flex-col">
                                      <Box marginTop={1} className="date-container" >
                                        <CalendarMonthOutlinedIcon />
                                        <LocalTimeDate utcDateTime={addon?.startTime} format="MMMM D" timezone="auto" fallbackText="Not Available" />
                                        <Typography>-</Typography>
                                        <LocalTimeDate utcDateTime={addon?.endTime} format="MMMM D" timezone="auto" fallbackText="Not Available" />
                                      </Box>

                                      <Box marginTop={.5} className="time-container">
                                        <TimerOutlinedIcon />
                                        <Typography marginTop={0.3}>
                                          {moment(addon?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(addon?.endTime).format("h:mm A")}
                                        </Typography>
                                      </Box>
                                    </Box>
                                    {/* <Grid size={6}>- ${addon?.amount}</Grid> */}
                                  </Grid>


                                  <div className="divider2"></div>

                                  {addon?.eventAddonProperties?.length > 0 ? (
                                    <Grid container size={12} flexDirection={"column"} justifyContent={'space-between'} columnSpacing={2} rowSpacing={1} className="add-on-prop-checkbox ">

                                      {addon?.eventAddonProperties.map((property: any) => {

                                        return property !== null && (

                                          <Grid size={12} display={'flex'} alignItems={'center'} justifyContent={"space-between"} className={`addon-property-checkbox-group-${templateId}`}>

                                            <CustomAddonProButton templateId={templateId} className={isAddonProp(property) ? `addon-property-checkbox-${templateId}-active` : ''} onClick={() => { handleClickAddonProp(property) }} />

                                            <Box className="flex items-center w-full">
                                              <Typography className="addon-prop-label">{property?.name}</Typography>
                                              <Typography>-</Typography>
                                              <Box className="flex items-center ml-auto">
                                                <Dollar className='addon-prop-money-icon' />
                                                <Typography className="addon-prop-amount">{Math.trunc(Number(property?.amount)) === 0 ? "Free" : `${property?.amount}`}</Typography>
                                              </Box>

                                            </Box>
                                          </Grid>

                                        )


                                      })}
                                    </Grid>


                                  ) : <></>


                                  }
                                  {addon?.eventAddonProperties?.[0] === null && <Grid size={12} display={'flex'} alignItems={'center'} justifyContent={"space-between"} className={`addon-property-checkbox-group-${templateId}`}>
                                    <CustomAddonProButton templateId={templateId} className={isAddonInCart(addon?.id) ? `addon-property-checkbox-${templateId}-active` : ''} onClick={() => { handleAddonClick(addon?.id) }} />
                                    {/* <Typography className="add-on-prop-label">{property?.name}-{property?.amount}</Typography> */}
                                    <Box className="flex items-center w-full">
                                      <Typography className="addon-prop-label">{addon?.addon?.name}</Typography>
                                      <Typography>-</Typography>
                                      <Box className="flex items-center ml-auto">
                                        <Dollar className='addon-prop-money-icon' />
                                        <Typography className="addon-prop-amount">{Math.trunc(Number(addon?.amount)) === 0 ? "Free" : `${addon?.amount}`}</Typography>
                                      </Box>

                                    </Box>
                                  </Grid>}
                                </Grid>
                              </Grid>

                            )
                          })}
                        </Grid>
                      )}
                    </Grid>



                  </Grid>}
              </>
            ))
          }

          <AddCoupon />

          <BillInfo />

          <Box className="spacer"></Box>
          <Grid className={`navigation-button-container-${templateId}`}>
            <CustomButton
              className="back-button"
              label="Back"
              variant="outlined"
              onClick={() => navigate(routes.programSelection())}
            />
            <CustomButton
              className="next-button"
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




const CustomAddonProButton = ({ onClick, className, templateId }: { onClick: () => void, className: string, templateId: number | null | undefined }) => {
  return (
    <Box onClick={onClick} className={clsx("addon-property-checkbox", `addon-property-checkbox-${templateId}`, className)}>
      {
        className === `addon-property-checkbox-${templateId}-active` ? <CheckIcon className='addon-property-checkbox-icon' /> : ''
      }
    </Box>
  )
}
