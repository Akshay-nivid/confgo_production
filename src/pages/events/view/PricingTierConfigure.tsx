import { useForm, useFieldArray } from "react-hook-form";
import Grid from "@mui/material/Grid2";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import AddCircleIcon from "../../../assets/svg/CircleAddIcon.svg";
import DeleteIcon from "../../../assets/svg/Close_circle.svg";
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import CustomButton from "@/components/CustomButton/CustomButton";
import { CloseOutlined } from "@mui/icons-material";
import PricingTable from "./PricingTable";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Logger } from "@/Utils/Logger";
import useStore from "@/Libs/store";
// import { watch } from "fs";

interface Attendee {
  id: number;
  attendeeName: string;
  attendeeDescription: string;
}

interface pricingTierConfigureProps {
  closeDrawer: () => void;
  hasPricingTiers: boolean;

}

interface PricingTier {
  id: number;
  tierName: string;
  percentage?: number;
  startDate: string;
  endDate: string;
}

interface FormValues {
  attendeeName: string;
  attendeeDescription: string;
  tierName: string;
  tierEndDate: string;
  tierStartDate: string;
  attendeeTypes: Attendee[];
  pricingTiers: PricingTier[];
  attendees: {
    pricingTiers: { tierName: string; percentage: number }[]; // Each attendee's pricing tiers with percentage
  }[];
}

/**
 * Component used to configure the table-
 * @param param0
 * @returns
 */
const PricingTierConfigure: React.FC<pricingTierConfigureProps> = ({
  closeDrawer,
  hasPricingTiers,
}) => {
  const { control, handleSubmit, setValue, getValues, trigger } =
    useForm<FormValues>({
      defaultValues: {
        attendeeName: "",
        attendeeDescription: "",
        tierName: "",
        tierEndDate: "",
        tierStartDate:"",
        attendeeTypes: [],
        pricingTiers: [],
        attendees: [
          {
            pricingTiers: [{ tierName: "", percentage: 0 }],
          },
        ],
      },
    });

  const { id } = useParams<{ id: string }>(); // Retrieve the ID from URL parameters

  const [attendeeFieldsData, setAttendeeFieldsData] = useState<Attendee[]>([]);
  const POST = useStore((state: any) => state.POST);
  const DELETE = useStore((state: any) => state.DELETE);
  const [pricingData, setPricingData] = useState<any[]>([]);
  const setDataById = useStore((state: any) => state.setDataById);
  const PUT = useStore((state: any) => state.PUT);
  const [priceTierResponse,setPriceTierResponse]= useState<any>([]);
  const [attendeeTypeResponse,setAttendeeTypeResponse] = useState<any>([]);
  // const {
  //   //fields: attendeeFieldsData,
  //   append: appendAttendee,
  //   remove: removeAttendee,
  // } = useFieldArray({
  //   control,
  //   name: "attendeeTypes",
  // });

  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({
    control,
    name: "pricingTiers",
  });

  /**
   * Used to fetch the already having attendee type name
   */
  const fetchAttendeeTypeList = async () => {
    try {
      POST({
        url: "/participant/type/list",
        body: { filters: { eventId: id } },
        id: "attendeeTypeList",
        successCB: (context: any) => {
          if (context?.success) {
            setAttendeeTypeResponse(context.data);
            const groupedByDesignation = context.data.map((item: any) => {
              return {
                id: item.id, // Keep id as is, assuming backend returns correct format
                attendeeName: item.name,
                attendeeDescription: item.description || "",
              };
            });

            setAttendeeFieldsData(groupedByDesignation);
            setValue("attendeeTypes", groupedByDesignation);
          }
        },
        errorCB: (context: any) => {
          Logger.error("RegistrationFee.tsx", context?.message);
        },
      });
    } catch (error) {
      Logger.error("RegistrationFee.tsx", error);
    }
  };

  /**
   * Function to add the Attendee name and description
   * @returns
   */
  const handleAddAttendeeType = async () => {
    const isValid = await trigger(["attendeeName"]);
    if (isValid) {
      const attendeeName = getValues("attendeeName");
      const attendeeDescription = getValues("attendeeDescription");
      // Check if attendeeName is empty or not
      if (attendeeName.trim() === "") {
        console.warn("Attendee name is required!");
        return; // Prevent appending if name is empty
      }

      // Create the payload conditionally
      const body: Record<string, any> = {
        name: attendeeName,
        eventId: id,
      };

      if (attendeeDescription?.trim()) {
        body.description = attendeeDescription; // Add description only if it's not empty
      }
      POST({
        url: "/participant/type",
        body,
        successCB: async (response: any) => {
          if (response.success) {
            await fetchAttendeeTypeList();
            setValue("attendeeName", "");
            setValue("attendeeDescription", "");
          }
        },
        errorCB: (context: any) => {
          Logger.error("Error adding new attendee type:", context?.message);
        },
      });
    } else {
      console.warn("Validation failed for Attendee Name.");
    }
  };

  /**
   * Function to delete the Attendee types
   * @param index
   */
  const handleDeleteAttendeeType = async (index: any) => {
    const attendeeField = attendeeFieldsData[index];
    const attendeeTypeId = attendeeField.id;
    try {
      // Make the API call to delete the Attendee Type
      await DELETE({
        url: `/participant/type/${attendeeTypeId}`,
        method: "DELETE",
        successCB: async () => {
          // Re-fetch the attendee type list to update the UI
          await fetchAttendeeTypeList();
        },
        errorCB: (error: any) => {
          console.error("Failed to delete attendee type:", error);
        },
      });
    } catch (error) {
      console.error("API call error on delete:", error);
    }
  };

  /**
   * Function to add the pricing tier name and date
   */
  const handleAddPricingTier = async () => {
    const isValid = await trigger(["tierName", "tierEndDate","tierStartDate"]);
    if (isValid) {
      const tierName = getValues("tierName");
      const endDate = getValues("tierEndDate");
      const startDate= getValues("tierStartDate");

          // Check if the tierName already exists in the current pricing tiers
    const isDuplicate = pricingFields.some((tier) => tier.tierName === tierName);

    if (isDuplicate) {
      console.warn("A tier with this name already exists.");
      return;
    }

      appendPricing({
        id: Number(Date.now().toString()),
        tierName,
        endDate,
        startDate,
      });

      setValue("tierName", "");
      setValue("tierEndDate", "");
      setValue("tierStartDate","");
    } else {
      console.warn("Validation failed for Tier Name or End Date.");
    }
  };

  /**
   * To get the all the Attendee types matching with the eventid
   */
  useEffect(() => {
    /**
     * Function to fetch the all pricing tier matching with the event id
     */
    const fetchPricingTierList = async () => {
      try {
        POST({
          url: "event/priceTier/list",
          body: { filters: { eventId: id } },
          id: "priceTierList",
          successCB: (context: any) => {
            if (context?.success) {
              setPriceTierResponse(context.data);
              const groupedByDesignation = context.data.map((item: any) => {
                return {
                  id: item.id,
                  tierName: item.name,
                  percentage: item.percentage || 0, // Use default percentage
                  endDate: item.endDate,
                  startDate: item.startDate,
                };
              });
              setValue("pricingTiers", groupedByDesignation);

              // Set default percentage for each attendee's pricing tiers
              const attendees = getValues("attendeeTypes") || [];
              const updatedAttendees = attendees.map((attendee) => ({
                ...attendee,
                pricingTiers: groupedByDesignation.map((tier: any) => ({
                  tierName: tier.tierName,
                  percentage: tier.percentage || 0,
                })),
              }));
              setValue("attendees", updatedAttendees);
            }
          },
          errorCB: (context: any) => {
            Logger.error("PricintTierConfig.tsx", context?.message);
          },
        });
      } catch (error) {
        Logger.error("PricingTierConfig.tsx", error);
      }
    };

    fetchAttendeeTypeList();
    fetchPricingTierList();
  }, []);

  // Filter out empty attendee types and pricing tiers
  const nonEmptyAttendees = attendeeFieldsData.filter((field) =>
    field.attendeeName.trim()
  );
  const nonEmptyPricingTiers = pricingFields.filter((field) =>
    field.tierName.trim()
  );

  const handlePricingDataSubmit = (pricingData: any) => {
    setPricingData(pricingData);
  };


  function mapData(priceTiersData: any[], attendeeData: any[]) {
    // Map pricing tiers
    const mappedPricingTiers = priceTiersData.map((tier) => ({
      id: tier.participantTypeId,
      tierName: tier.name,
      percentage: tier.percentage,
      endDate: tier.endDate,
      startDate: tier.startDate,
    }));
    // Map attendees with their corresponding pricing tiers
    const mappedAttendees = attendeeData.map((attendee) => ({
      id: attendee.id,
      attendeeName: attendee.name,
      attendeeDescription: attendee.description,
      pricingTiers: mappedPricingTiers.filter(
        (tier) => tier.id === attendee.id // Only include pricing tiers that match this attendee's ID
      ),
    }));
    return { pricingTiers: mappedPricingTiers, attendees: mappedAttendees };
  }
  
  const processedData = mapData(
    priceTierResponse,
    attendeeTypeResponse
  );


  /**
   * Submition of the values
   */
  function onSubmit() {
    const { attendeeTypes, attendees, pricingTiers }:any = getValues();
    console.log("pricingtiers", pricingTiers);


    const payload = {
      eventId: id, // Pass the eventId directly
      priceTiers: pricingTiers
        .filter((tier:any) => tier.tierName?.trim()) // Skip tiers with empty or null names
        .flatMap((tier:any) =>
          attendeeTypes.map((attendee:any, index:any) => {
            const percentage =
              attendees[index]?.pricingTiers[tier.tierName]?.percentage || ""; // Fetch percentage for the tier and attendee type
            return {
              name: tier.tierName,
              percentage: parseFloat(percentage),
              participantTypeId: attendee.id,
              endDate: tier.endDate || "",
              startDate:tier.startDate || "",
            };
          })
        ),
    };
    // Post the prepared payload
    if (!hasPricingTiers) {
      // If there are no pricing tiers, use POST
      POST({
        url: `/event/priceTier`,
        body: payload,
        successCB: () => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "success",
            message: "Table created",
          });
          closeDrawer();
        },
        errorCB: () => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: "Failed to create the table.",
          });
        },
      });
    } else {
      // If pricing tiers exist, use PUT
     PUT({
        url: `/event/priceTier/update/${id}`,
        body: payload,
        successCB: () => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "success",
            message: "Table updated",
          });
          closeDrawer()
        },
        errorCB: () => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: "Fill the percentage in the table",
          });
        },
      });
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        justifyContent={"space-between"}
        alignItems="center"
        size={{ xs: 12 }}
      >
        <Typography
          className="registration-fee-list-heading"
        >
          Registration Fee Structure
        </Typography>

        <IconButton onClick={closeDrawer}>
          <CloseOutlined />
        </IconButton>
      </Grid>
      <Box sx={{ maxWidth: 600 }}>
        <Grid container spacing={2} padding={3}>
          <Grid size={{ xs: 12 }}>
            <Typography className="registration-fee-list-sub-heading">
              Configure Attendee Type
            </Typography>
          </Grid>
          <Grid size={{ xs: 5 }}>
            <CustomTextField
              name="attendeeName"
              control={control}
              label="Attendee Type Name"
              placeholder="Attendee Type Name"
              rules={{ required: "Attendee Name is required" }}
            />
          </Grid>
          <Grid size={{ xs: 5 }}>
            <CustomTextField
              name="attendeeDescription"
              control={control}
              label="Description (Optional)"
              placeholder="Description (Optional)"
            />
          </Grid>
          <Grid size={{ xs: 2 }} display="flex" alignItems="center">
            <IconButton onClick={handleAddAttendeeType}>
              <AddCircleIcon className="registration-fee-list-circle-add-icon" />
            </IconButton>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {attendeeFieldsData.map((field, index) => {
                return field.attendeeName.trim() ? (
                  <Chip
                    className="registration-fee-list-chip"
                    key={field.id}
                    label={`${field.attendeeName}`}
                    onDelete={() => handleDeleteAttendeeType(index)}
                    deleteIcon={<DeleteIcon />}
                  />
                ) : null;
              })}
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography className="registration-fee-list-sub-heading">
              Configure Pricing Tiers
            </Typography>
          </Grid>

          <Grid size={{ xs: 5 }}>
            <CustomTextField
              name="tierName"
              control={control}
              label="Tier Name"
              placeholder="Tier Name"
              rules={{ required: "Tier Name is required" }}
            />
          </Grid>

          <Grid size={{ xs: 5 }}>
            <CustomDatePicker
              placeholder="Start Date"
              name="tierStartDate"
              control={control}
              rules={{ required: "Start Date is required" }}
              label="Start Date"
              requiredField
            />
          </Grid>
          <Grid size={{ xs: 5 }}>
            <CustomDatePicker
              placeholder="End Date"
              name="tierEndDate"
              control={control}
              rules={{ required: "End Date is required" }}
              label="End Date"
              requiredField
            />
          </Grid>
          <Grid size={{ xs: 2 }} display="flex" alignItems="center">
            <IconButton color="primary" onClick={handleAddPricingTier}>
              <AddCircleIcon className="registration-fee-list-circle-add-icon" />
            </IconButton>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {pricingFields.map((field, index) => {
                return field.tierName.trim() ? (
                  <Chip
                    className="registration-fee-list-chip"
                    key={field.id}
                    label={`${field.tierName}`}
                    onDelete={() => removePricing(index)}
                    deleteIcon={<DeleteIcon />}
                  />
                ) : null;
              })}
            </Box>
          </Grid>
        </Grid>
        <Grid container padding={3} paddingBottom={0} paddingTop={1}>
          <Grid>
            <Typography className="registration-fee-list-sub-heading">
              Registration Fee Structure
            </Typography>
          </Grid>
          {nonEmptyAttendees.length > 0 && (
            <PricingTable
              pricingTiers={nonEmptyPricingTiers}
              attendees={processedData.attendees}
              control={control}
              payLoad={pricingData}
              onSubmitData={handlePricingDataSubmit}
            />
          )}
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          alignItems="flex-end"
          paddingRight={3}
          style={{ minHeight: "10vh" }}
        >
          <CustomButton
            label="Submit"
            onClick={() => onSubmit()}
            className="event-sessions-edit-button"
          />
        </Grid>
      </Box>
    </form>
  );
};

export default PricingTierConfigure;
