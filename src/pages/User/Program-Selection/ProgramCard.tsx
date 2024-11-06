import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import apiClient from "@/Libs/Https/API-client";
import useStore from "@/Libs/store";
import routes from "@/router/routes";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { Box, Typography } from "@mui/material";
import moment from "moment";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";

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

  const { control, handleSubmit, setValue, reset } = useForm<any>();

  const navigate = useNavigate();
  const setDataById = useStore((state: any) => state.setDataById);
  const eventInfo = useStore((state: any) => state?.compData?.["eventSelected"]) ?? '';
  const eventDetails = useStore((state: any) => state?.compData?.["eventDetails"]) ?? '';

  /**
   * Method used to call event details Api
   */
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(`event/${eventInfo?.id}`);
      const { status, data } = processAPIResponse(response, "event");
      if (status) {
        setDataById("eventDetails", { data, programs: sortData(data?.programs), addOns: sortData(data?.addons) });
      }
    };
    fetchData();
  }, []);

  /**
   * Used to set selected value checked
   */
  useEffect(() => {
    // Reset form values based on selectedDetails
    if (eventDetails.selectedDetails) {
      const defaultValues: any = {};
      Object.entries(eventDetails?.selectedDetails)?.forEach(([date, details]: any) => {
        defaultValues[`${moment(date).format("MM/DD/YYYY")}-programs`] = details?.programs?.map((program: any) => program.id);
        defaultValues[`${moment(date).format("MM/DD/YYYY")}-addons`] = details?.addons?.map((addon: any) => addon.addonId);
      });
      reset(defaultValues);
    }
  }, [eventDetails])

  /**
   * Method used to sort data
   * @param data 
   * @returns 
   */
  const sortData = (data: IProgram[]): any => {
    if (!data?.length) {
      return {};
    }
    return data
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .reduce((grouped: any, program) => {
        const date = new Date(program.startTime).toISOString().split('T')[0];

        if (!grouped[date]) {
          grouped[date] = [];
        }

        grouped[date].push(program);
        return grouped;
      }, {});
  };

  /**
   * Method used to handle next button click
   * @param data 
   */
  function onNext(data: any) {
    setDataById("eventDetails", {
      selectedDetails: handlePrograms(data)
    });
    navigate(routes.selectedPrograms());
  }

  /**
   * Method to group seletced programs
   * @param data 
   */
  const handlePrograms = (data: any) => {
    const output: any = {};
    Object.entries(data).forEach(([key, value]) => {
      const [date, type] = key.split('-');

      if (!output[date]) {
        output[date] = { addons: [], programs: [] };
      }
      if (type === 'addons') {
        output[date][type] = Array.isArray(value)
          ? eventDetails?.data?.addons.filter((addon: any) => value.includes(addon.id))
          : [];
      } else if (type === 'programs') {
        output[date][type] = Array.isArray(value)
          ? eventDetails?.data?.programs.filter((program: any) => value.includes(program.id))
          : [];
      }
    });
    Object.keys(output).forEach(date => {
      if (output[date].addons.length === 0 && output[date].programs.length === 0) {
        output[date] = {}; // Set to a blank object if both are empty
      }
    });
    return output
  }

  return (
    <form className="program-card-form" onSubmit={handleSubmit(onNext)}>
      <Box className="space-y-10">
        {eventDetails?.programs && Object.entries(eventDetails?.programs).map(([date, programs]: any, index) => (
          <Box key={`${date}-${programs?.id}-program`} className="program-card">
            <Box className="program-date-container">
              <Typography className="program-date">
                Day {index + 1} -
                {moment(date).format("MMM DD, YYYY")}
              </Typography>
            </Box>

            <Grid className="select-program-text">Select Your Programme:</Grid>
            {programs?.map((program: IProgram) =>
              <Grid container size={12} direction={'row'} className="program-list-container">
                <Grid className="program-list-item">
                  <CustomCheckbox
                    control={control}
                    className="program-list-item-checkbox"
                    id={program?.name}
                    name={`${moment(date).format("MM/DD/YYYY")}-programs`}
                    setValue={setValue}
                    options={[
                      {
                        label: program?.name,
                        value: program?.id,
                      },
                    ]}
                  />
                </Grid>
                <Grid size={6}>- {moment(program?.startTime).format("h:mm A")} - ${program?.amount}</Grid>
              </Grid>)}
            {eventDetails?.data?.addons?.length > 0 && (
              <Grid container size={12} direction={'row'} className="add-on-list-container">
                {eventDetails?.addOns && Object.entries(eventDetails?.addOns).map(([dates, addOn]: any, index: number) => (
                  <>
                    {addOn?.map((item: any) => (
                      <Grid key={`${dates}-${item?.addonId}-addon`}>
                        <Grid className="select-add-on-text">Food Selection:</Grid>
                        <Grid key={index} className="add-on-list-item">
                          <CustomCheckbox
                            control={control}
                            className="add-on-list-item-checkbox "
                            id={item?.addonId}
                            name={`${moment(date).format("MM/DD/YYYY")}-addons`}
                            options={[
                              {
                                label: item?.name,
                                value: item?.addonId,
                              },
                            ]}
                          />
                          <Grid size={6}>- ${item?.amount}</Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </>
                ))}
              </Grid>
            )}
          </Box>
        )
        )}
      </Box>
      <Box className="navigation-button-container">
        <CustomButton
          variant="outlined"
          className="back-button"
          label="Back"
          type="submit"
        />
        <CustomButton className="next-button" label="Next" type="submit" />
      </Box>
    </form>
  );
};

export default ProgramCard;
