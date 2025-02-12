
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { POST, GET, setDataById, IStoreState, snackBar, setNonPersistedDataById } from "@/Libs/store";
import routes from "@/router/routes";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { handleClickBackButton, handleGroupData, processFormData, toggleProgramCheckboxesByDate, validateAddon, validateAddonWithNoProp, validatePrograms } from "./programsHandlers";
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

  const { handleSubmit, setValue, getValues, reset } = methods


  const defaultFormData = useStore((state: any) => state?.compData?.["defaultProgramData"]?.formData) || undefined;


  const eventData = useStore((state: IStoreState) => state?.compData?.["eventData"]) ?? undefined;


  const eventId = useStore((state: IStoreState) => state?.compData?.eventSelected?.id)

  const addToCartResponseData = useStore((state: IStoreState) => state?.compData?.addToCart)

  const addToCartLoading = addToCartResponseData?.cart?.loading ?? false

  const event: { data: IEventResponse; success: boolean; loading: boolean } = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`])

  const slugName = useStore((state: IStoreState) => state?.compData?.slugName?.value) || ''

  const participantTypeId = useStore((state: IStoreState) => state?.compData?.participantTypeId?.value)

  const templateId = useStore((state: IStoreState) => state.compData?.templateId?.id)

  const cartId = useStore((state: IStoreState) => state?.compData?.userDetails?.userCart?.id)

  const eventDataLoading = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`]?.loading) ?? false

  const [currentTab, setCurrentTab] = useState(0);

  const userToken = sessionStorage.getItem('token')
  const userRole = sessionStorage.getItem('userRole')

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
          if(data?.cart?.parentEventId !== eventId) return

          if (status) {

            const formatedData = handleGroupData({
              addons: data?.addons,
              programs: data?.programs
            })

         const obj:any = {}


            Object?.keys(formatedData)?.forEach((date: any) => {

              formatedData[date]?.programs?.forEach((program: any) => {


                const pKey = `${moment(program?.startTime).format('YYYY/MM/DD')}-programs`

                obj[pKey] = [...(obj[pKey] || []),program?.id]

              })

              formatedData?.[date]?.addons?.forEach((addon: any) => {

                addon?.eventAddonProperties?.forEach((item: any) => {

                  const aKey = `${moment(addon?.startTime).format('YYYY/MM/DD')}-addonProp-${addon?.id}`

                  obj[aKey] = [...(obj[aKey] || []), item?.id]
                })







              })

                setDataById("defaultProgramData",{formData:obj})


            })

            setNonPersistedDataById("intialGetCart", {value: true})

          } else {
            snackBar({ severity: 'error', message })
            return
          }

        }).catch((err) => {
          snackBar({ severity: 'error', message: err?.message || 'something went wrong' })
        })

        // getUserCart({ helperFn: handleNavigateToCart, cartID: cartId })
        // setNonPersistedDataById('intialGetCart', { value: true })
      }


    }

    return

  }, [])


  /**
    * Method used to call event details Api
    */
  useEffect(() => {

    //  (async()=>await fetchEventDetailsFn(10000))()

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
        },

        errorCB: () => { }

      });
    };

    fetchEventDetails();

  }, []);



  function handleNavigate() {
    navigate(routes.selectedPrograms())
  }

  /**
   * method to handle submission of form, triggers add selected properties to cart api 
   * @param formData 
   * @returns 
   */
  function handleClickNextButton(formData: any) {



    try {


      setDataById('defaultProgramData', { formData: formData }) // storing form data for setting default values in next screen 


      const body = processFormData(formData, eventId, participantTypeId) // processing form data to match cart api body format

      const selectedPrograms = body?.programIds || null;

      validatePrograms(selectedPrograms)

      validateAddon(formData)


      validateAddonWithNoProp(body?.addons)


      POST({
        url: 'cart',
        body: body,
        id: 'addToCart',

        successCB: (data: any) => {

          const cartID = data?.data?.id

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
   * When user toggles an addon checkbox, this function is called.
   * It takes the key of the checkbox as an argument. The key is in the format of "date-ADDON-addonId"
   * It first splits the key into date, ADDON, and addonId. Then it sets the value of the corresponding checkbox in the form to undefined.
   * This is used to remove the addon from the cart when the user unchecks the checkbox.
   * @param key - the key of the checkbox in the format of "date-ADDON-addonId"
   */
  function onToggleAddonCheckBox(key: string) {

    const formData = getValues()


    const [date, _, id] = key.split("-")

    const addonProps = getValues(`${date}-addonProp-${id}`)

    if (addonProps === undefined || !addonProps || addonProps.length === 0) {
      snackBar({ severity: "error", message: "Please select at least one property" })
      return
    }

    const inputKey = `${date}-addonProp-${id}`

    if (inputKey in formData) {
      const updateFormData = { ...formData, [inputKey]: undefined }
      reset(updateFormData)
      return
    }

    return
  }




  /**
   * Handles toggling of a program checkbox. It takes the key of the checkbox as an argument.
   * The key is in the format of "date-PROGRAM-programId". It calls the toggleProgramCheckboxesByDate function
   * which takes care of toggling the checkbox and setting the value of the corresponding program to undefined
   * if the checkbox is unchecked. This is used to remove the program from the cart when the user unchecks the checkbox.
   * @param key - the key of the checkbox in the format of "date-PROGRAM-programId"
   */
  function handleToggleProgramCheckbox(key: string) {
    toggleProgramCheckboxesByDate({ key, setValue, getValues })
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
                    {eventData?.programs && eventData?.programs && Object.entries(eventData.programs).map(([date]: any, index) => (
                      <CustomButton onClick={() => setCurrentTab(index)} className={clsx("tab-btn", currentTab === index ? `active-${templateId}` : `inactive-${templateId}`)} label={`Day-${index + 1} ${moment(date).format("MMM DD, YYYY")}`} />
                    ))}
                  </Box>


                </Box>

                {eventData?.programs && eventData?.programs && Object.entries(eventData.programs).map(([date, programs]: any, index) => index === currentTab && (

                  <>

                    <Grid container className="program-addon-container" rowSpacing={{ xs: 3 }} columnSpacing={3} >

                      {programs?.programs?.map((program: IProgram, index: number) => (

                        <Programcard date={date} program={program} handleToggleProgramCheckbox={handleToggleProgramCheckbox} templateId={templateId} key={index} />


                      ))}

                      {programs.addons?.map((addon: any) => {



                        return (
                          <>
                            <AddonCard addon={addon} date={date} onToggleAddonCheckBox={onToggleAddonCheckBox} templateId={templateId} key={addon.id} />
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
