
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { POST, GET, setDataById, IStoreState, snackBar, setNonPersistedDataById } from "@/Libs/store";
import routes from "@/router/routes";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { handleClickBackButton, handleGroupData } from "./programsHandlers";
import clsx from "clsx";
import AddonCard from "../Components/AddonCard";
import Programcard from "../Components/Programcard";
import LocalTimeDate from "@/components/LocalTimeDate/LocalTimeDate";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { getUserCart } from "@/pages/events/template/programHandler";
import { IEventResponse } from "@/Libs/types/event";
import ProgramDetailsModal from "./ProgramDetailsModal";
import HTMLReactParser from "html-react-parser/lib/index";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";


export interface IProgram {
  id: number;
  parentId: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  venueId: number;
  eventClass: string;
  interval: string;
  companyId: number;
  title: string;
  amount: string;
  discount: any;
  statusId: number;
  status: Status;
  eventProgramSchedules: any[];
}

export interface Status {
  id: number;
  statusName: string;
  description: string;

}

/**
 * component used to draw programs 
 * @returns 
 */
const ProgramSelection = () => {

  const navigate = useNavigate();
  const methods = useForm<any>({ defaultValues: {} });

  const { handleSubmit, reset } = methods


  // const defaultFormData = useStore((state: any) => state?.compData?.["defaultProgramData"]?.formData) || undefined;

  const defaultFormData = useStore((state) => state?.nonPersistedData?.["defaultProgramData"]?.formData) || undefined;



  const eventData = useStore((state: IStoreState) => state?.compData?.["eventData"]) ?? undefined;

  const eventInitialFetchDone = useStore(state => state.nonPersistedData?.eventInitialFetchDone?.value) || false

  const eventId = useStore((state: IStoreState) => state?.compData?.eventSelected?.id)

  const addToCartResponseData = useStore((state: IStoreState) => state?.compData?.addToCart)

  const addToCartLoading = addToCartResponseData?.cart?.loading ?? false

  const event: { data: IEventResponse; success: boolean; loading: boolean } = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`])

  const slugName = useStore((state: IStoreState) => state?.compData?.slugName?.value) || ''

  const participantTypeId = useStore((state: IStoreState) => state?.compData?.participantTypeId?.value)

  const templateId = useStore((state: IStoreState) => state.compData?.templateId?.id)

  const cartId = useStore((state: IStoreState) => state?.compData?.userDetails?.userCart?.id)

  const eventDataLoading = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`]?.loading) ?? false

  const [currentTab, setCurrentTab] = useState<any>(0);

  const userToken = sessionStorage.getItem('token')
  const userRole = sessionStorage.getItem('userRole')



  const cart = useStore((state: IStoreState) => state?.nonPersistedData?.cart)




  // const isIntialGetCartCalled = useStore(state => state?.nonPersistedData.intialGetCart?.value)

  /**
   * method to handle already existing cart
   */

  // check if user is logged in or not. if logged in call cart api and get the cart data
  useEffect(() => {




    if (userToken && userRole === 'USER') {



      // if (isIntialGetCartCalled) return // return if cart api is called for the first time

      if (cartId) {

        apiClient.get(`cart/${cartId}`).then((response: any) => {


          const { status, message, data } = processAPIResponse(response, 'getCart')


          // return if current event id and event id get from user cart history are not same
          if (data?.cart?.parentEventId !== eventId) return

          if (status) {

            setNonPersistedDataById("intialGetCart", { value: true })


            const allData = [...(data?.addons || []), ...(data?.programs || [])]

            if (allData.length === 0) return

            const cartItems = allData.reduce((acc, item: any) => {

              if(item?.startTime && new Date(item?.startTime) < new Date()) {
                return acc
              }

              if (item?.addonId) {

                if (item?.eventAddonProperties?.length === 0 || item?.eventAddonProperties?.[0] === null  ) {

                  acc.addons.push({
                    addonId: item?.id
                  })
                } else {
                  acc.addons.push({
                    addonId: item?.id,
                    propertyIds: item?.eventAddonProperties?.map((item: any) => item?.id)
                  })
                }

              } else {
                acc?.programIds?.push(item?.id)
              }

              return acc

            }

              , { programIds: [], addons: [] })

            setNonPersistedDataById('cart', { ...cart, ...cartItems })

          } else {
            snackBar({ severity: 'error', message })
            return
          }

        }).catch((err) => {
          snackBar({ severity: 'error', message: err?.message || 'something went wrong' })
        })
      }


    }

    return

  }, [])


  /**
    * Method used to call event details Api
    */
  useEffect(() => {

    if (eventInitialFetchDone) return
    const fetchEventDetails = async () => {


      if (!eventId) {

        if (slugName) {

          navigate(routes.participantHome(slugName));

          return

        }

        navigate(routes.userLogin());
        return

      }


      GET({

        url: `event/${eventId}`,
        id: 'eventData',

        successCB: (response: {
          data: IEventResponse;
          loading: boolean;
          success: boolean;
        }) => {

          const formatedData = handleGroupData({
            addons: response?.data?.addons,
            programs: response?.data?.programs
          })



          setDataById("eventData", { programs: formatedData });
          setNonPersistedDataById("eventInitialFetchDone", { value: true })
        },

        errorCB: () => { }

      });
    };

    fetchEventDetails();

  }, [eventInitialFetchDone]);



  function handleNavigate() {
    navigate(routes.selectedPrograms())
  }

  /**
   * method to handle submission of form, triggers add selected properties to cart api 
   * @param formData 
   * @returns 
   */
  function handleClickNextButton() {

    if (cart?.addons?.length === 0 && cart?.programIds?.length === 0) {
      snackBar({ severity: 'error', message: 'please select atleas a program or addon' })
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

        successCB: (data: any) => {


          const cartID = data?.data?.id

          setNonPersistedDataById('shouldPostCart', { value: false })
          getUserCart({ helperFn: handleNavigate, cartID: cartID })

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
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      snackBar({ severity: "error", message: errorMessage || "something went wrong", autoHideDuration: 3000 })
    }

  }




  /**
   * setting form default value
   */
  useEffect(() => {
    reset(defaultFormData)
  }, [defaultFormData])


  if (eventDataLoading) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  if (!eventId) {

    if (slugName) {
      return <Navigate to={routes.eventExternalLink(slugName)} />
    }
    return <Navigate to={routes.userLogin()} />
  }



  return (
    <Grid
      justifyContent={"center"}
      alignItems={"center"}
      container
      className="program-main"
    >
      <Grid size={12} className="content-container">
        <Box className="header-container">
          <Typography textAlign={"center"} className="main-header">
            Program Selection
          </Typography>

        </Box>
        <Box className="programs-container space-y-12">
          <FormProvider {...methods}>
            <form className={`program-form`} onSubmit={handleSubmit(handleClickNextButton)}>

              <Box className="program-list-wrapper">

                <Box className="event-header-container">
                  <Typography className="event-header"><span>{event?.data?.name}</span></Typography>
                  <Typography className="event-description" > <span>{event?.data?.description && HTMLReactParser(event?.data?.description)}</span></Typography>
                  <Box className="flex items-center gap-x-2">
                    <CalendarMonthOutlinedIcon />
                    <LocalTimeDate className="event-date" utcDateTime={event?.data?.startTime} />
                    <Typography className="event-header">-</Typography>
                    <LocalTimeDate className="event-date" utcDateTime={event?.data?.endTime} />
                  </Box>



                </Box>

                <Box className="tab-btn-container">
                  <Box className="tab-btn-inner-container">
                    {eventData?.programs && eventData?.programs && Object.entries(eventData.programs).map(([date]: any, index) => {
                      return <CustomButton onClick={() => setCurrentTab(index)} className={clsx("tab-btn", currentTab === index ? `active-${templateId}` : `inactive-${templateId}`)} label={date === 'general' ? 'General Addons' : `Day-${index + 1} ${moment(date).format("MMM DD, YYYY")}`} />
                    })}
                  </Box>
                </Box>
                {eventData?.programs && eventData?.programs && Object.entries(eventData.programs).map(([date, programs]: any, index) => index === currentTab && (
                  <>
                    <Grid container className="program-addon-container" rowSpacing={{ xs: 3 }} columnSpacing={3} >

                      {programs?.programs?.map((program: IProgram, index: number) => (

                        <Programcard date={date} program={program} templateId={templateId} key={index} />



                      ))}



                      {programs.addons?.map((addon: any) => {



                        return (
                          <>
                            <AddonCard addon={addon} date={currentTab=='general'?'': date} templateId={templateId} key={addon.id} />
                          </>
                        )
                      })}
                    </Grid>


                    <Grid container className="add-on-list-container">
                      <Grid size={12} container >
                        <Box width={'100%'} className="space-y-4">

                        </Box>
                      </Grid>
                    </Grid>
                  </>
                ))}
              </Box>

              <Box className={`navigation-button-container-${templateId}`}>

                <CustomButton
                  variant="outlined"
                  className="back-button"
                  label="Back"
                  onClick={() => handleClickBackButton(slugName, navigate)}
                />
                <CustomButton isLoading={addToCartLoading} className={"next-button"} label="Next" type="submit" />
              </Box>
            </form>
          </FormProvider>
          <ProgramDetailsModal className="program-selection-modal" />
        </Box>
      </Grid>
    </Grid>
  );
};


export default ProgramSelection;
