import { Typography, IconButton, Box, Chip, Tooltip } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomButton from "@/components/CustomButton/CustomButton";
import Grid from "@mui/material/Grid2";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect, useState } from "react";
import moment from "moment";
import { useFieldArray } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import apiClient from "@/Libs/Https/API-client";
import { getLocalTimeDate, processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { useParams } from "react-router-dom";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CreateAddon from "../CreateAddon";
import CustomSwitch from "@/components/CustomSwitch/CustomSwitch";
import CustomTimePicker from "@/components/CustomTimePicker/CustomTimePicker";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import { POST } from "@/Libs/store";

interface FormData {
  addonId: number;
  isPaid: "PAID" | "FREE";
  startTime: string;
  endTime: string;
  description: string;
  amount: string;
  propertyName: string;
  propertyAmount: string;
  properties: {
    propertyName: string;
    propertyAmount: string;
  }[];
  dateRequired: boolean;
  addonDate: string;
  repeat: string[];
  noOfDays: string;
}

interface SessionAddonDrawerProps {
  isEditing: boolean;
  selectedAddOn: any;
  onSubmit: (data: FieldValues) => void;
  closeDrawer: () => void;
  eventData: any;
  onSubmitHandler:()=>void
}

/**
 * SessionAddonDrawer Component
 * Drawer to create or edit session add-ons.
 * @param isEditing - Indicates if the form is in editing mode
 * @param selectedAddOn - selected add-on data (if editing)
 * @param onSubmit - Callback to handle form submission
 * @param closeDrawer - Callback to close the drawer
 */
const SessionAddonDrawer: React.FC<SessionAddonDrawerProps> = ({ isEditing, selectedAddOn, onSubmit, closeDrawer, eventData, onSubmitHandler }) => {
  const { id } = useParams();
  const [addOnOptions, setAddOnOptions] = useState<{ label: string; value: string | number }[]>([]);
  const [selectedAddOnId, setSelectedAddOnId] = useState<string | number | null>(null);
  const [newAddOnView, setNewAddonView] = useState(false);

  const { control, setValue, handleSubmit, watch, reset, setError, clearErrors } = useForm<FormData>({
    defaultValues: {
      isPaid: isEditing && selectedAddOn?.amount > 0 ? "PAID" : "FREE",
      startTime: selectedAddOn ? selectedAddOn.startTime : "",
      endTime: selectedAddOn ? selectedAddOn.endTime : "",
      description: selectedAddOn ? selectedAddOn?.description : "",
      amount: selectedAddOn ? selectedAddOn.amount : "",
    },
  });

  /**
   * Closes the add-on drawer.
   */
  const handleDrawerClose = () => {
    setNewAddonView(false);
  };

  /**
   * Fetches and sets new add-on options created for the dropdown from the API.
   */
  const onaddOnSubmitHandler = async () => {
    await handleAddOnOptionsApiCall();
  };

  const isPaid = watch("isPaid");
  const isAddon = watch("addonId");
  const isDescription = watch("description");
  const addonProperties = watch("properties");
  const buttonDisbaled = !isAddon || !isDescription || addonProperties === undefined || addonProperties?.length === 0;
  const [endTimeChanged, setEndTimeChanged] = useState(false);
  const [startTimeChanged, setStartTimeChanged] = useState(false);
  const { fields, remove, append } = useFieldArray({
    control,
    name: "properties",
  });

  /**
   * useEffect to call the method to fetch addon options from the api for dropdown values
   */
  useEffect(() => {
    const fetchAddOnOptions = async () => {
      await handleAddOnOptionsApiCall();
    };
    fetchAddOnOptions();
  }, []);

  /**
   * Fetches and sets add-on options for the dropdown from the API.
   */
  const handleAddOnOptionsApiCall = async () => {
    const response = await apiClient.post("addon/list", {});
    const { status, data } = await processAPIResponse(response, "event-add-on");
    if (status) {
      const optionsData = data?.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      const updatedOptionsData = [...optionsData, { label: "Create new Add-on name", value: "other" }];
      setAddOnOptions(updatedOptionsData);
    }
  };

  /**
   * Closes the add-on drawer, but prevents the drawer from closing if there is any data in the form that has not been saved yet.
   * If there is unsaved data, it will display an error message snackbar.
   */

  function handleCloseDrawer() {
    closeDrawer()
  }

  /**
   * fills form fields if editing with selected add-on values, otherwise resets fields to default values.
   */
  useEffect(() => {
    if (isEditing && selectedAddOn) {
      setSelectedAddOnId(selectedAddOn?.addon?.id);
      setValue("description", selectedAddOn?.description);
      setValue("addonDate", moment(selectedAddOn?.startTime).format("YYYY-MM-DD"));
      setValue("startTime", startTimeChanged ? moment.utc(selectedAddOn?.startTime).format("HH:mm A") : getLocalTimeDate(selectedAddOn?.startTime));
      setValue("endTime", endTimeChanged ? moment.utc(selectedAddOn?.endTime).format("HH:mm A") : getLocalTimeDate(selectedAddOn?.endTime));
      setValue("isPaid", selectedAddOn.amount > 0 ? "PAID" : "FREE");
      setValue("amount", selectedAddOn.amount);
      setValue("dateRequired", !!selectedAddOn?.endTime);

      const properties = selectedAddOn.eventAddonProperties.map((property: { name: any; amount: any }) => ({
        propertyName: property.name,
        propertyAmount: property.amount,
      }));
      setValue("properties", properties);
    } else {
      reset({
        isPaid: "FREE",
        startTime: "",
        endTime: "",
        description: "",
        amount: "",
        propertyName: "",
        propertyAmount: "",
      });
    }
  }, [isEditing, selectedAddOn, reset, setValue]);

  /**
   * Adds a property to the properties array based on form inputs.
   */
  const handleAddProperty = () => {
    // Collect current values
    const propertyName = watch("propertyName")?.trim();
    const propertyAmount = watch("propertyAmount")?.trim();
    const isPaid = watch("isPaid");



    // Reset previous errors
    clearErrors(["propertyName", "propertyAmount"]);

    // Validation object to track errors
    const validationErrors: Record<string, { type: string; message: string }> = {};

    // Validation logic
    if (isPaid === "PAID") {
      // For PAID properties, both name and amount are required
      if (!propertyName) {
        validationErrors.propertyName = {
          type: "required",
          message: "Property name is required"
        };
      }

      if (!propertyAmount) {
        validationErrors.propertyAmount = {
          type: "required",
          message: "Property amount is required"
        };
      }

      // Additional amount validation for PAID properties
      if (propertyAmount && isNaN(Number(propertyAmount))) {
        validationErrors.propertyAmount = {
          type: "pattern",
          message: "Property amount must be a valid number"
        };
      }
    } else if (isPaid === "FREE") {
      // For FREE properties, only name is required
      if (!propertyName) {
        validationErrors.propertyName = {
          type: "required",
          message: "Property name is required"
        };
      }
    }

    // If there are validation errors, set them and stop
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        setError(field as any, {
          type: error.type,
          message: error.message
        });
      });
      return;
    }

    if (propertyName) {
      append({ propertyName, propertyAmount });
      setValue("propertyName", "");
      setValue("propertyAmount", "");
    }
    setValue("isPaid", "FREE")

    clearErrors();
  };


  /**
   * Formats the form data and passing it to the onSubmit handler.
   * @param form data
   */
  const handleFormSubmit = (data: FieldValues) => {
    if (!data.properties || data?.properties.length === 0) {
      setError(`propertyName`, {
        type: 'manual',
        message: `Minimum one Addon property should be there`,
      });
      return;
    } else {
      const startDate = moment(eventData.startTime).startOf('day');
      const endDate = moment(eventData.endTime).startOf('day');
      const differenceInDays = endDate.diff(startDate, 'days') + (startDate.isBefore(endDate) ? 1 : 0);

      if (parseInt(data?.noOfDays) > differenceInDays) {
        setError(`noOfDays`, {
          type: 'manual',
          message: `Maximum ${differenceInDays} can be repeated!`,
        });
        return;
      }

      const formattedDataArray: any[] = []; 
      if (data.noOfDays !== '' && data?.repeat?.length > 0) {
        // Create the base data structure without including the date
        const baseFormattedData: any = {
          addonId: Number(selectedAddOnId),
          // amount: data.amount,
          description: data.description,
          properties: Array.isArray(data.properties) && data.properties.length > 0
            ? data.properties.map((property: any) => ({
              name: property.propertyName,
              amount: property.propertyAmount || 0,
              description: "  ",
              // enabled: 1,
            }))
            : [],
        };

        if (data.dateRequired) {
          baseFormattedData.startTime = `${data.addonDate} ${moment(data.startTime, ["hh:mm A"]).format("HH:mm")}`;
          baseFormattedData.endTime = `${data.addonDate} ${moment(data.endTime, ["hh:mm A"]).format("HH:mm")}`;
        }

        // Loop through the number of days
        for (let i = 0; i < parseInt(data.noOfDays); i++) {
          const newAddon = { ...baseFormattedData };
          const currentDate = new Date(newAddon.startTime);
          currentDate.setDate(currentDate.getDate() + i); // Add i days to the start date

          // Update the date field
          const date = currentDate.toISOString().split('T')[0]; // Format the date

          // Update startTime and endTime with the new date
          newAddon.startTime = `${date} ${moment(newAddon.startTime).format("HH:mm")}`;
          newAddon.endTime = `${date} ${moment(newAddon.endTime).format("HH:mm")}`;

          // Add the formatted data to the array
          formattedDataArray.push(newAddon); // This ensures you're adding to an array, not an object
        }
      } else {
        // If no looping is required, generate just one formattedData
        const formattedData: any = {
          // eventId: Number(id),
          addonId: Number(selectedAddOnId),
          // amount: data.amount,
          description: data.description,
          properties: Array.isArray(data.properties) && data.properties.length > 0
            ? data.properties.map((property: any) => ({
              name: property.propertyName,
              amount: property.propertyAmount || 0,
              description: "  ",
              // enabled: 1,
            }))
            : [],
        };

        if (data.dateRequired) {
          formattedData.startTime = `${data.addonDate} ${moment(data.startTime, ["hh:mm A"]).format("HH:mm")}`;
          formattedData.endTime = `${data.addonDate} ${moment(data.endTime, ["hh:mm A"]).format("HH:mm")}`;
        }
        formattedDataArray.push(formattedData);
      }
      if (isEditing) {
        onSubmit(formattedDataArray);
      } else {
        addonCreateSubmit(formattedDataArray);
      }
    }
  };


  const addonCreateSubmit = (data: any) => {
    const request = {
      eventId: Number(id),
      addons: data
    }
    POST({
      url: '/event/addon/add',
      body: request,
      id: 'createMultipleAddon',
      successCB: (_context) => {
        closeDrawer();
        onSubmitHandler();

      },
      errorCB: (_context) => {

      },
    })
  }


  return (

    <Box sx={{ maxWidth: 600 }}>
      <Grid container rowGap={3} columnSpacing={2} padding={2} className="pb-5 ">
        <Grid container rowSpacing={4} justifyContent="space-between" alignItems="center" size={{ xs: 12 }}>
          <Typography className="event-detail-speakers-card-contributor-header">
            {isEditing ? "Edit Add-on" : "Add Add-on"}
          </Typography>
          <IconButton onClick={handleCloseDrawer}>
            <CloseOutlined />
          </IconButton>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomSelect
            name="addonId"
            label="Select Add-on"
            options={addOnOptions}
            optionClick={(value) => {
              setSelectedAddOnId(value);
              if (value === "other") {
                setNewAddonView(true);
              }
            }}
            control={control}
            rules={{ required: "Addon selection is required" }}
            defaultValue={isEditing ? selectedAddOn?.addon?.id : ""} // Only set defaultValue when editing
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <CustomTextField
            name="description"
            placeholder="Add-on Description"
            control={control}
            rules={{ required: "Add-on Description is required" }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12 }}>
          <CustomSwitch
            className="add-program-switch-btn"
            buttonColor="success"
            label="Add Date and Time?"
            name="dateRequired"
            control={control}
          />
        </Grid>

        {/* Conditionally render date and time fields */}
        {watch("dateRequired") && (
          <>
            <Grid size={{ xs: 12 }}>
              <CustomTextField name="addonDate" placeholder="Add-on Date" control={control} type="date"
                min={moment(eventData?.startTime).format("YYYY-MM-DD")}
                max={moment(eventData?.endTime).format("YYYY-MM-DD")} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <CustomTimePicker
                name="startTime"
                label="Start Time"
                placeholder="Start Time"
                control={control}
                type="time"
                ampm={true}
                defaultValue={getLocalTimeDate(selectedAddOn?.startTime)}
                onValueChange={() => {
                  setStartTimeChanged(true)
                }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <CustomTimePicker
                name="endTime"
                label="End Time"
                placeholder="End Time"
                control={control}
                type="time"
                ampm={true}
                defaultValue={getLocalTimeDate(selectedAddOn?.endTime)}
                onValueChange={() => {
                  setEndTimeChanged(true)
                }}
              />
            </Grid>
          </>
        )}
        {!isEditing && watch("dateRequired") && <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"}>
          <Grid size={{ xs: 12, sm: 12 }}>
            <Grid container display={"flex"} alignItems={"center"}>
              <CustomCheckbox
                className="add-addons-check-btn"
                options={[{ label: 'Repeat', value: 'YES' }]}
                control={control}
                name={`repeat`}
                onChange={() => {
                  setValue(`noOfDays`, '')
                }}
              />
              <Tooltip title="No of Days once Saved can't be edited" arrow>
                <IconButton className="add-addons-warning-msg"
                >
                  {/* <ErrorOutlineIcon /> */}
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }} display={"flex"} justifyContent={"space-between"}>
              {/* Conditionally render Number of Days field */}
              {watch(`repeat`)?.length > 0 && (
                <Grid size={{ xs: 12, sm: 12 }}>
                  <CustomTextField
                    placeholder="Number of days"
                    control={control}
                    name={`noOfDays`}
                    type="number"
                    rules={{ required: true }}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>}
        {/* <Grid size={{ xs: 12 }}>
          <CustomTextField name="amount" placeholder="Price" control={control} type="number" requiredField={true} />
        </Grid> */}

        <Grid size={{ xs: 12 }}>
          <Typography className="event-detail-speakers-card-contributor-header">Add Properties</Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CustomRadio
            name="isPaid"
            options={[
              { label: "Paid", value: "PAID" },
              { label: "Free", value: "FREE" },
            ]}
            control={control}
            row
          />
        </Grid >
        <Grid size={12} container className="border border-gray-100 w-full py-6 p-4 rounded-md " rowSpacing={2}>
          <Grid size={{ xs: 6 }}>
            <CustomTextField name="propertyName" placeholder="PropertyName" control={control} rules={{
              validate: () => Array.isArray(addonProperties) && addonProperties.length > 0 || "Please add at least one property"
            }} />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <CustomTextField
              prefixIcon={<AttachMoneyIcon />}
              disabled={isPaid === "PAID" ? false : true}
              name="propertyAmount"
              placeholder="Price"
              control={control}
              type="number"
              rules={{
                required: {
                  value: isPaid === "PAID" ? true : false,
                  message: "Price is required",
                },
              }}
            />
          </Grid>

          <Grid size={12} mt={1}>
            {/* <IconButton className="add-program-prop-add" onClick={handleAddProperty}>
            <AddIcon />
          </IconButton> */}
            <CustomButton label="Add Property" startIcon={<AddIcon />} onClick={handleAddProperty} className="add-program-add-property-btn" />
          </Grid>
          {fields.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Grid container spacing={1}>
                {fields.map((item, index) => (
                  <Grid key={item.id}>
                    <Chip
                      className="add-program-chip-item"
                      onDelete={() => remove(index)}
                      label={`${item.propertyName} ${item.propertyAmount ? " - " + item.propertyAmount : ""}`}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Grid container justifyContent="right" className="mb-5">
            <CustomButton
              label="Create Addon"
              disabled={buttonDisbaled}
              onClick={handleSubmit(handleFormSubmit)}
              className="event-sessions-edit-button "
            />
          </Grid>
        </Grid>
        <CustomDrawer
          children={<CreateAddon submitHandler={onaddOnSubmitHandler} closeDrawer={handleDrawerClose} />}
          open={newAddOnView}
          type="right"
          onClose={() => handleDrawerClose}
        />
      </Grid>
    </Box>
  );
};

export default SessionAddonDrawer;
