import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import useStore from "@/Libs/store";
import { Badge, Box, Typography } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  program: string;
  addons: string;
}
const ProgramCard: React.FC = () => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      program: undefined,
      addons: undefined,
    },
  });

  const { Post } = useStore();
  function onSubmit(data: any) {
    console.log(data);
  }

  useEffect(() => {
    Post({ u });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box className=" space-y-10">
        {sortedData.map((program, index) => (
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
                  name={`program.${index}`}
                  label={program.name}
                  data={[{ label: program.name, value: program.name }]}
                />
              </Box>
              {/* <Box className="program-list-item">{program.name}</Box> */}
            </Box>

            <Box className="select-food-text">Food Selection:</Box>

            <Box className="food-list-container">
              <Box className="">
                {data.addon.map((item) => (
                  <Box className="food-list-item">
                    <CustomCheckbox
                      control={control}
                      className="food-list-item-checkbox "
                      id={item.addonId}
                      name={`addons.${index}`}
                      label={item.title}
                      data={[{ label: item.title, value: item.title }]}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      <CustomButton label="Submit" type="submit" />
    </form>
  );
};

export default ProgramCard;

const data = {
  name: "Health Club",
  title: "Blood Test",
  amount: "50000.00",
  description: "Blood Test Camp",
  statusId: "3",
  interval: " not required ",
  startTime: "2024-10-25",
  endTime: "2024-10-30",
  venue: {
    name: "Science Hall",
    address: "Left block",
    city: "Bangalore",
    state: "Karnataka",
    country: "INDIA",
    postalCode: "560062",
    totalCapacity: "100",
  },
  programs: [
    {
      name: "Dengue test",
      title: "Dengue Testing",
      startTime: "2024-10-30",
      endTime: "2024-10-30",
      statusId: "3",
      interval: " not required ",
      amount: "30.00",
      description: "testing blood",
    },
    {
      name: "Maleria test",
      title: "Maleria Testing",
      statusId: "3",
      interval: " not required ",
      startTime: "2024-10-25",
      endTime: "2024-10-30",
      amount: "30.00",
      description: "testing blood",
    },
  ],
  addon: [
    {
      addonId: "1",
      title: "Breakfast",
      amount: "20.0",
      startTime: "2024-10-25",
      endTime: "2024-10-30",
      tier: "not rquired",
    },
    {
      addonId: "1",
      amount: "45.00",
      title: "Lunch",
      startTime: "2024-10-25",
      endTime: "2024-10-30",
      tier: "not rquired",
    },
    {
      addonId: "1",
      amount: "45.00",
      title: "Evening Snack",
      startTime: "2024-10-25",
      endTime: "2024-10-30",
      tier: "not rquired",
    },
  ],
};

const sortedData = data.programs.sort((a, b) => {
  const data =
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  return data;
});

console.log(sortedData);
