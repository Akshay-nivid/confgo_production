import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import useStore, { POST, GET, PUT } from "@/Libs/store";
import routes from "@/router/routes";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import {  useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { formatDate, handleGroupData, isAnyProgramSelectedForDate, processFormData, toggleProgramCheckboxesByDate } from "./programsHandlers";


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

  const { control, handleSubmit, setValue, watch, getValues,reset } = useForm<any>({ defaultValues:{} });

  const cartId = addToCartResponseData?.cart?.data?.id || null;

  const addToCartLoading = cartId ? addToCartResponseData?.[`cart/${cartId}`]?.loading : !!addToCartResponseData?.cart?.loading;

  const eventDataLoading = useStore((state: any) => state?.compData?.["eventData"]?.[`event/${eventId}`]?.loading) ?? false

  const slugName = useStore((state: any) => state?.compData?.["slugName"]?.slugName) || '';

  const participantTypeId = useStore((state: any) => state?.compData?.["participantTypeId"]?.value) ?? null

  /**
    * Method used to call event details Api
    */
  useEffect(() => {

    const fetchEventDetails = async () => {

      if (!eventId) {
        navigate(routes.participantHome(slugName));
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
   * method to handle submission of form, triggers add selected properties to cart api 
   * @param formData 
   * @returns 
   */
  function handleClickNextButton(formData: any) {

    setDataById('defaultProgramData', { formData: formData }) // storing form data for setting default values in next screen 


    const body = processFormData(formData, eventId,participantTypeId) // processing form data to match cart api body format

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


    const addonsWithNoAddonProp = body.addons && body?.addons.some((addon: any) => {
      
        return !addon?.propertyIds || addon?.propertyIds?.length === 0
      
    })


    if(addonsWithNoAddonProp){
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

              const formatedData = handleGroupData({
                addons: response?.data?.addons,
                programs: response?.data?.programs,
                calculateTotal: true
              })

              setDataById("formatedCartData", { formatedData: formatedData })

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
  }



  /**
   * When user toggles an addon checkbox, this function is called.
   * It takes the key of the checkbox as an argument. The key is in the format of "date-ADDON-addonId"
   * It first splits the key into date, ADDON, and addonId. Then it sets the value of the corresponding checkbox in the form to undefined.
   * This is used to remove the addon from the cart when the user unchecks the checkbox.
   * @param key - the key of the checkbox in the format of "date-ADDON-addonId"
   */
  function onToggleAddonCheckBox(key: string) {
    const [date, _, id] = key.split("-")

    setValue(`${date}-addonProp-${id}`, undefined)

  }



 
  /**
   * Handles toggling of a program checkbox. It takes the key of the checkbox as an argument.
   * The key is in the format of "date-PROGRAM-programId". It calls the toggleProgramCheckboxesByDate function
   * which takes care of toggling the checkbox and setting the value of the corresponding program to undefined
   * if the checkbox is unchecked. This is used to remove the program from the cart when the user unchecks the checkbox.
   * @param key - the key of the checkbox in the format of "date-PROGRAM-programId"
   */
  function handleToggleProgramCheckbox(key: string) {
    toggleProgramCheckboxesByDate({key, setValue, getValues})
  }

/**
 * setting form default value
 */
  useEffect(() => {
    reset(defaultFormData)
  }, [])
  

  if (eventDataLoading) {
    return (
      <Backdrop  open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }



  return (

    <form className="program-card-form" onSubmit={handleSubmit(handleClickNextButton)}>
      <Box className="space-y-10">
        {eventData?.programs && Object.entries(eventData.programs).map(([date, programs]: any, index) => (
          <Box key={`${date}-program`} className="program-card">
            <Box className="program-date-container">
              <Typography className="program-date">
                Day {index + 1} - {moment(date).format("MMM DD, YYYY")}
              </Typography>
            </Box>

            <Grid className="select-program-text">Program:</Grid>
            {programs?.programs?.map((program: IProgram) => (
              <Grid container key={program.id} direction="row" className="program-list-container">
                <Grid className="program-list-item">
                  <CustomCheckbox
                    onChange={() => handleToggleProgramCheckbox(`${formatDate(date)}-programs`)}
                    control={control}
                    className="program-list-item-checkbox"
                    id={program?.name}
                    name={`${formatDate(date)}-programs`}
                    setValue={setValue}
                    options={[
                      {
                        label: program?.name,
                        value: program?.id,
                      },
                    ]}
                  />
                </Grid>
                <Grid >- {moment(program?.startTime).format("h:mm A")} - ${program?.amount}</Grid>
              </Grid>
            ))}

            <Grid container direction="row" className="add-on-list-container">
              <Grid>
                {programs.addons.length > 0 && <Grid className="select-add-on-text">Addon:</Grid>}
                <Box className="space-y-4">
                  {programs.addons?.map((addon: any, index: number) => {
                    const currentAddon = `${formatDate(date)}-addon-${addon?.id}`
                    const isDisabled = !isAnyProgramSelectedForDate(date, watch);
                    return (
                      <Box key={`addon-${addon.addonId}-${index}`}>
                        <Grid  display="flex" className="add-on-list-item">
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
                                label: addon?.addon?.name,
                                value: addon?.id,
                              },
                            ]}
                          />
                          <Grid className="flex gap-x-4">
                            <Grid>- ${addon?.amount}</Grid>
                            <Grid>- {moment(addon?.startTime).format("h:mm A")}</Grid>
                          </Grid>



                        </Grid>
                        {addon?.eventAddonProperties?.length > 0 && (
                          <Grid container paddingBlock={1} paddingInline={1} columnSpacing={2}>

                            {addon.eventAddonProperties.map((property: any) => (
                              < CustomCheckbox
                                className="add-on-property "
                                key={`${property?.id}-${property?.name}-${addon?.addonId}`}
                                disabled={watch(currentAddon) === undefined || watch(currentAddon).length === 0}
                                row={true}
                                control={control}
                                required={false}
                                name={`${formatDate(date)}-addonProp-${addon?.id}`}
                                options={[
                                  { label: property?.name, value: property?.id },
                                ]}
                              />))}
                          </Grid>
                        )}
                      </Box>
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
          onClick={() => navigate(-1)}
        />
        <CustomButton isLoading={addToCartLoading} className={"next-button"} label="Next" type="submit" />
      </Box>
    </form>
  );
};


export default ProgramCard;




