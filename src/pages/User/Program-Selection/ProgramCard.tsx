import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import useStore, { POST, GET, PUT } from "@/Libs/store";
import routes from "@/router/routes";
import { Backdrop, Box, Chip, CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { formatDate, handleClickBackButton, handleGroupData, isAnyProgramSelectedForDate, processFormData, toggleProgramCheckboxesByDate } from "./programsHandlers";
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { getUserToken } from "@/Utils/CommonBaseClass";
import clsx from "clsx";

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
const ProgramCard = () => {

  const defaultFormData = useStore((state: any) => state?.compData?.["defaultProgramData"]?.formData) || undefined;

  const navigate = useNavigate();

  const setDataById = useStore((state: any) => state.setDataById);

  const eventData = useStore((state: any) => state?.compData?.["eventData"]) ?? undefined;

  const eventId = useStore((state: any) => state?.compData?.["eventSelected"]?.id) ?? null;

  const addToCartResponseData = useStore((state: any) => state?.compData?.["addToCart"]) ?? null;

  const { control, handleSubmit, setValue, watch, getValues, reset } = useForm<any>({ defaultValues: {} });

  const cartId = addToCartResponseData?.cart?.data?.id || null;

  const addToCartLoading = cartId ? addToCartResponseData?.[`cart/${cartId}`]?.loading : !!addToCartResponseData?.cart?.loading;

  const eventDataLoading = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`]?.loading) ?? false

  const slugName = useStore((state: any) => state?.compData?.["slugName"]?.value) || '';

  const participantTypeId = useStore((state: any) => state?.compData?.["participantTypeId"]?.value) ?? null

  const templateId = useStore((state: any) => state.compData?.["templateId"]?.id)

  const classNamePrefix = `program-card-form-${templateId}`

  /**
    * Method used to call event details Api
    */
  useEffect(() => {

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




/**
 * API call to get payment details for an event
 * @param {number} eventId - event id
 * @returns {void}
 */
  const getPaymentDetails = () => {

    POST({
      url: 'participant/payment/details',
      id: 'paymentDetails',
      body: { eventId: eventId },
      successCB: (response: any) => {

        console.log(response, 'payment details')
        
    }})

  }


  /**
   * method to handle submission of form, triggers add selected properties to cart api 
   * @param formData 
   * @returns 
   */
  function handleClickNextButton(formData: any) {


    const isUserLoggedIn = getUserToken()


    if (!isUserLoggedIn) {
      setDataById('defaultProgramData', { formData: formData })
      setDataById('previousRoute', { url: { pathname: routes.programSelection() } })
      navigate(routes.userLogin())
      return
    }

    getPaymentDetails()  // to check if user already registered for this event

    setDataById('defaultProgramData', { formData: formData }) // storing form data for setting default values in next screen 


    const body = processFormData(formData, eventId, participantTypeId) // processing form data to match cart api body format

    const selectedPrograms = body.programIds || null;


    if (selectedPrograms.length === 0 || selectedPrograms === undefined || !selectedPrograms) {

      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: 'Please select at least one program and addon property',
      })

      return
    }


    const addonsWithNoAddonProp = body?.addons && body?.addons.some((addon: any) => {

      return addon?.propertyIds !== undefined && addon?.propertyIds?.length === 0

    })


    if (addonsWithNoAddonProp) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: 'Please select at least one property for each selected addon.',
      });
      return;
    }

    if (!cartId) {
      POST({
        url: 'cart',
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

              setDataById("finalPrice", { value: response?.data?.cart?.finalPrice })

              setDataById("formatedCartData", { formatedData: formatedData }) // storing data after formatting for mapping in ui

              navigate(routes.selectedPrograms());

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
    else {

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

              setDataById("finalPrice", { value: response?.data?.cart?.finalPrice })

              const formatedData = handleGroupData({
                addons: response?.data?.addons,
                programs: response?.data?.programs,
                calculateTotal: true
              })

              setDataById("formatedCartData", { formatedData: formatedData })

              navigate(routes.selectedPrograms(),{replace: true});

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

    <form className={`program-card-form ${classNamePrefix}`} onSubmit={handleSubmit(handleClickNextButton)}>
      <Box className="space-y-10">

        {eventData?.programs && eventData?.programs && Object.entries(eventData.programs).map(([date, programs]: any, index) => (

          <Box key={`${date}-program`} className="program-card">
           
            <Grid display={'flex'} justifyContent={'center'} flexDirection={'column'} alignItems={'center'} className="select-program-text card-header-wrapper ">

              <Box className="program-date-container">
                <Typography className="card-header">
                  Day {index + 1} - {moment(date).format("MMM DD, YYYY")}
                </Typography>
              </Box>

              <Typography className="card-header">Program</Typography>

            </Grid>

            {programs?.programs?.map((program: IProgram) => (

              <Grid marginBottom={2} columnSpacing={2} container key={program.id} className={clsx("program-list-container", watch(`${formatDate(date)}-programs`)?.includes(program?.id) ? 'checked' : 'un-checked')}>

                <Grid size={'grow'} container>

                  <Grid marginBottom={1} size={12} borderRadius={10} width={"max-content"}>
                    <Chip className="time-chip" size="medium" icon={<TimerOutlinedIcon />} label={moment(program?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(program?.endTime).format("h:mm A")} />
                  </Grid>

                  <Grid size={12} marginBottom={.5} fontSize={20} fontWeight={500}>{program.name}</Grid>

                  <Grid size={12} fontSize={12} fontWeight={400} >
                    <Typography className="program-description">
                      {program.description}
                    </Typography>
                  </Grid>

                  <Grid marginTop={3} className="program-list-item">
                    <CustomCheckbox

                      onChange={() => handleToggleProgramCheckbox(`${formatDate(date)}-programs`)}
                      control={control}
                      className="program-list-item-checkbox"
                      id={program?.name}
                      name={`${formatDate(date)}-programs`}
                      setValue={setValue}
                      options={[
                        {
                          label: '',
                          value: program?.id,

                        },
                      ]}
                    />
                    <Typography className="add-text">{watch(`${formatDate(date)}-programs`)?.includes(program?.id) ? 'Remove' : 'Add'}</Typography>

                  </Grid>


                </Grid>

                <Grid className="program-price">
                  <Chip className="price-chip" size="medium" icon={<AttachMoneyOutlinedIcon />} label={`${program?.amount}`} />
                </Grid>

                <Grid className='pl-8' size={12}></Grid>
              </Grid>
            ))}

            <Grid container size={12} marginTop={8} className="add-on-list-container">
              <Grid size={12} container >


                {programs.addons.length > 0 && <Grid textAlign={'center'} marginBottom={2} size={12} className="card-header card-header-wrapper">Addon</Grid>}
                <Box width={'100%'} className="space-y-4">
                  {programs.addons?.map((addon: any, index: number) => {

                    const currentAddon = `${formatDate(date)}-addon-${addon?.id}`
                    const isDisabled = !isAnyProgramSelectedForDate(date, watch);

                    return (
                      <>

                        <Box className={clsx("addon-card", watch(`${formatDate(date)}-addon-${addon?.id}`)?.includes(addon?.id) ? 'checked' : 'un-checked')} width={"100%"} key={`addon-${addon.addonId}-${index}`}>
                          <Grid container size={12} className="add-on-list-item">

                            <Grid size={'grow'}>

                              <Grid marginBottom={1} size={12} borderRadius={10} width={"max-content"}>
                                <Chip className="time-chip" size="medium" icon={<TimerOutlinedIcon />} label={moment(addon?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(addon?.endTime).format("h:mm A")} />
                              </Grid>


                              <Grid size={12} marginBottom={.5} fontSize={24} fontWeight={500}>{addon?.addon?.name}</Grid>

                              <Grid size={12} fontSize={12} fontWeight={400} >
                                <Typography className="program-description">
                                  {addon?.addon?.description}
                                </Typography>
                              </Grid>

                            </Grid>

                            <Grid marginBottom={3} size={'auto'} className="program-price">
                              <Chip className="price-chip" size="medium" icon={<AttachMoneyOutlinedIcon />} label={`${addon?.amount}`} />
                            </Grid>


                          </Grid>

                          {addon?.eventAddonProperties?.length > 0 && <Grid marginTop={2} className='card-sub-header'>Addon Prop :</Grid>}
                          {(addon?.eventAddonProperties && addon?.eventAddonProperties?.length > 0) ? (
                            <Grid paddingInline={1} container columnSpacing={2}>

                              {addon.eventAddonProperties.map((property: any) => (
                                <Grid display={'flex'} alignItems={'center'} size={4} className='addon-property-item'>
                                  < CustomCheckbox
                                    className="add-on-property "
                                    key={`${property?.id}-${property?.name}-${addon?.addonId}`}
                                    disabled={watch(currentAddon) === undefined || watch(currentAddon).length === 0}
                                    row={true}
                                    control={control}
                                    required={false}
                                    name={`${formatDate(date)}-addonProp-${addon?.id}`}
                                    options={[
                                      { label: '', value: property?.id },
                                    ]}
                                  />
                                  <Typography className="add-on-property-name">{property?.name}-{property?.amount}</Typography>
                                </Grid>
                              ))}
                            </Grid>
                          ) : <></>}
                          <Grid marginTop={3}  className='addon-checkbox-group'>

                            <CustomCheckbox
                              disabled={isDisabled}
                              control={control}
                              className="add-on-list-item-checkbox"
                              onChange={() => {
                                onToggleAddonCheckBox(`${formatDate(date)}-addon-${addon?.id}`)
                              }}
                              id={addon?.addonId}
                              name={`${formatDate(date)}-addon-${addon?.id}`}
                              options={[
                                {
                                  label: '',
                                  value: addon?.id,
                                },
                              ]}
                            />

                            <Typography className="add-text">{watch(`${formatDate(date)}-addon-${addon?.id}`)?.includes(addon?.id) ? 'Remove' : 'Add'}</Typography>

                          </Grid>
                        </Box>
                      </>
                    )
                  })}
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>
      <Box className="navigation-button-container">
        <CustomButton
          variant="outlined"
          className="back-button"
          label="Back"
          onClick={() =>handleClickBackButton(slugName,navigate)}
        />
        <CustomButton isLoading={addToCartLoading} className={"next-button"} label="Next" type="submit" />
      </Box>
    </form>
  );
};


export default ProgramCard;




