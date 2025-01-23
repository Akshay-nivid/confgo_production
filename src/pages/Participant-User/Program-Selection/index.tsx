
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { POST, GET, setDataById, IStoreState, snackBar } from "@/Libs/store";
import routes from "@/router/routes";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { fetchEventDetailsFn, handleClickBackButton, handleGroupData, processFormData, toggleProgramCheckboxesByDate, validateAddon, validateAddonWithNoProp, validatePrograms } from "./programsHandlers";
import clsx from "clsx";
import AddonCard from "../Components/AddonCard";
import Programcard from "../Components/Programcard";
import parse from 'html-react-parser';
import LocalTimeDate from "@/components/LocalTimeDate/LocalTimeDate";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { getUserCart } from "@/pages/events/template/programHandler";


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

  const event = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`])

  const slugName = useStore((state: IStoreState) => state?.compData?.slugName?.value) || ''

  const participantTypeId = useStore((state: IStoreState) => state?.compData?.participantTypeId?.value)

  const templateId = useStore((state: IStoreState) => state.compData?.templateId?.id)

  // const classNamePrefix: string = `program-card-form-${templateId}`

  const eventDataLoading = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`]?.loading) ?? false

  const [currentTab, setCurrentTab] = useState(0);


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

        successCB: (response: any) => {
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

      validateAddon(formData)

      setDataById('defaultProgramData', { formData: formData }) // storing form data for setting default values in next screen 


      const body = processFormData(formData, eventId, participantTypeId) // processing form data to match cart api body format

      const selectedPrograms = body.programIds || null;


      validatePrograms(selectedPrograms)


      validateAddonWithNoProp(body?.addons)


// if (selectedPrograms.length === 0 || selectedPrograms === undefined || !selectedPrograms) {

      //   setDataById("snackBarInfo", {
      //     open: true,
      //     autoHideDuration: 2000,
      //     severity: "error",
      //     message: 'Please select at least one program and addon property',
      //   })

      //   return
      // }

      // const addonsWithNoAddonProp = body?.addons && body?.addons.some((addon: any) => {

      //   return addon?.propertyIds !== undefined && addon?.propertyIds?.length === 0

      // })


      // if (addonsWithNoAddonProp) {
      //   setDataById("snackBarInfo", {
      //     open: true,
      //     autoHideDuration: 2000,
      //     severity: "error",
      //     message: 'Please select at least one property for each selected addon.',
      //   });
      //   return;
      // }

      POST({
        url: 'cart',
        body: body,
        id: 'addToCart',

        successCB: (data: any) => {

          const cartID = data?.data?.id

          getUserCart({helperFn: handleNavigate,cartID:cartID}) 

          // GET({
          //   url: `cart/${cartID}`,
          //   id: 'getCart',
          //   successCB: (response: any) => {

          //     const formatedData = handleGroupData({
          //       addons: response?.data?.addons,
          //       programs: response?.data?.programs,
          //       calculateTotal: true
          //     })

          //     setDataById("finalPrice", { value: response?.data?.cart?.finalPrice })

          //     setDataById("formatedCartData", { formatedData: formatedData }) // storing data after formatting for mapping in ui

          //     navigate(routes.selectedPrograms());

          //   },
          //   errorCB: (error: any) => {

          //     setDataById("snackBarInfo", {
          //       open: true,
          //       autoHideDuration: 2000,
          //       severity: "error",
          //       message: error?.message || 'something went wrong',
          //     })

          //   }
          // })

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
    } catch (e: any) {

      snackBar({ severity: "error", message: e?.message || "something went wrong", autoHideDuration: 3000 })
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
  }, [])


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
                  <Typography className="event-description" > <span>{event?.data?.description && parse(event?.data?.description)}</span></Typography>
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
        </Box>
      </Grid>
    </Grid>
  );
};


export default ProgramSelection;
