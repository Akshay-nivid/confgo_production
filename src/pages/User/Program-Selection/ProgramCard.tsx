import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import apiClient from "@/Libs/Https/API-client";
import useStore from "@/Libs/store";
import routes from "@/router/routes";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { validateMinLength } from "@/Utils/Validation";
import { Box, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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
interface FormValues {
  programs: [string];
  addons: [string];
}
const ProgramCard: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      programs: undefined,
      addons: undefined,
    },
    mode: "onBlur",
    reValidateMode: "onSubmit",
  });

  const navigate = useNavigate();
  const {
    compData: { event },
    setDataById,
    POST,
  } = useStore();

  function onNext(data: any) {
    console.log(data);
    const body = {
      programIds: data.programs,
      gender: "Tom",
      designation: "Jacks@123",
      addonIds: data.addons ? data.addons : [],
      amountPaid: "100",
      profileImageUrl: "8765433219",
      metadata: "male",
      eventId: event.id,
      participantTypeId: "1",
      registrationType: "ONLINE",
    };
    console.log(body, "body data");
    navigate(routes.selectedPrograms(), {
      state: {
        selectedProgramsId: data.programs,
        selectedAddonsId: data.addons,
      },
    });
    // POST({
    //   url: "participant",
    //   body,
    //   id: "selectedPrograms",
    //   successCB: (data) => {
    //     console.log(data);
    //   },
    //   errorCB: () => {},
    // });
  }

  event.programs.sort(
    (a: IProgram, b: IProgram) =>
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Step 2: Group by date
  const groupedPrograms = event.programs.reduce(
    (acc: IProgram[][], program: IProgram) => {
      const programDate = new Date(program.startTime)
        .toISOString()
        .split("T")[0]; // Extract the date part only
      const lastGroup = acc[acc.length - 1];

      if (lastGroup && lastGroup[0].startTime.startsWith(programDate)) {
        lastGroup.push(program);
      } else {
        acc.push([program]);
      }

      return acc;
    },
    []
  );

  console.log(groupedPrograms, "groupedPrograms");

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get("event/7");
      console.log(response);
      const proccessedData = processAPIResponse(response, "event");
      setDataById("event", response?.data?.data);
    };
    fetchData();
  }, []);

  const sortedData = event?.programs
    ? event.programs.sort((a: IProgram, b: IProgram) => {
        console.log(new Date(a.startTime).toISOString().split("T")[0]);
        const data =
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        return data;
      })
    : [];

  return (
    <form className="program-card-form" onSubmit={handleSubmit(onNext)}>
      <Box className=" space-y-10">
        {sortedData.map((program: IProgram, index: number) => (
          <Box key={index} className="program-card">
            <Box className="program-date-container">
              <Typography className="program-date">
                Day {index + 1}-
                {moment(program?.startTime).format("MMM DD, YYYY")}
              </Typography>
            </Box>

            <Box className="select-program-text">Select Your Programme:</Box>

            <Box className="program-list-container">
              {/* Uncomment this block when CustomCheckbox is ready */}
              <Box className="program-list-item">
                <CustomCheckbox
                  control={control}
                  className="program-list-item-checkbox"
                  id={program.name}
                  name={`programs`}
                  rules={{
                    validate: (value) => {
                      if (value?.length > 0) {
                        return true;
                      } else {
                        setDataById("snackBarInfo", {
                          open: true,
                          autoHideDuration: 2000,
                          severity: "error",
                          message: "Please select a program",
                        });
                        return false;
                      }
                    },
                  }}
                  label={program.name}
                  data={[
                    {
                      label: program.name + " - " + "$" + program.amount,
                      value: program.id,
                    },
                  ]}
                />
              </Box>
              {/* <Box className="program-list-item">{program.name}</Box> */}
            </Box>

            {event?.addons.length > 0 && (
              <>
                <Box className="select-food-text">Food Selection:</Box>

                <Box className="food-list-container">
                  <Box className="">
                    {event?.addons.map((item, index) => (
                      <Box key={index} className="food-list-item">
                        <CustomCheckbox
                          control={control}
                          className="food-list-item-checkbox "
                          id={item.addonId}
                          name={`addons`}
                          label={item.title}
                          data={[
                            {
                              label: item.title + "-" + item.price,
                              value: item.addonId,
                            },
                          ]}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </Box>
        ))}
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
