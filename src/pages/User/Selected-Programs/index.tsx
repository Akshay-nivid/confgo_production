import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { CouponIcon } from "@/assets/svg";
import { useLocation } from "react-router-dom";
import useStore from "@/Libs/store";
import { IProgram } from "../Program-Selection/ProgramCard";
import moment from "moment";
const SelectedPrograms = () => {
  const selectedProgramIdArray = useLocation().state;

  const {
    compData: { event },
  } = useStore();
  const { control } = useForm();

  console.log(event.programs, "event");
  console.log(selectedProgramIdArray, "selectedProgramIdArray");
  const selectedPrograms = event?.programs
    ? event.programs
        .filter((item: any) =>
          selectedProgramIdArray?.selectedProgramsId?.includes(
            item.id.toString()
          )
        )
        .sort((a: IProgram, b: IProgram) => {
          const data =
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          return data;
        })
    : [];
  console.log(selectedPrograms);
  return (
    <Grid container className="selected-programs-main">
      <Grid size={12} container className="selected-program-wrapper">
        <Grid size={12} className="selected-programs-main-header">
          <Typography textAlign={"center"} className="header-title ">
            Your Selection and Bill Summary
          </Typography>
          <Typography textAlign={"center"} className="header-description">
            Review your selected programs and meals below.
          </Typography>
        </Grid>

        <Grid
          size={12}
          display={"flex"}
          flexDirection={"column"}
          rowGap={5}
          className=""
        >
          {selectedPrograms.map((program: IProgram, index: number) => (
            <Box
              width={"100%"}
              key={index}
              className="selected-program-card-wrapper"
            >
              <Box className="selected-program-card-content">
                <Typography className="sub-header">
                  Day {index + 1}-
                  {moment(program?.startTime).format("MMM DD, YYYY")}
                </Typography>
                <Typography className="sub-header">
                  Programs Selected:
                </Typography>
                <Box className="program-list-container">
                  <CustomCheckbox
                    control={control}
                    className="program-list-item-checkbox"
                    id="program"
                    name="program"
                    row="vertical"
                    data={[
                      { label: program.name, value: program.id, checked: true },
                    ]}
                  />
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

              <Box className="divider "></Box>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                className="subtotal-container"
              >
                <Typography className="total-text">
                  Subtotal for Day {index + 1}
                </Typography>
                <Typography className="total-text">
                  $ {program.amount}
                </Typography>
              </Box>
            </Box>
          ))}
          <Box className="coupon-container">
            <Typography className="coupon-header-text">
              Apply Coupons
            </Typography>
            <Grid container columnSpacing={3}>
              <Grid size={8}>
                <CustomTextField
                  size="large"
                  control={control}
                  name="coupon"
                  placeholder="Apply Coupon Code"
                />
              </Grid>
              <Grid size={4}>
                <CustomButton
                  className="apply-coupon-button"
                  label="Apply Coupon"
                  size="large"
                  variant="outlined"
                  startIcon={<CouponIcon className="coupon-icon" />}
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="grand-total-container">
            <Typography className="total-text">Grand Total</Typography>
            <Typography className="total-text">$315</Typography>
          </Box>

          <Box className="navigation-btn-group-container">
            <CustomButton
              className="back-btn"
              label="Back"
              variant="outlined"
            />
            <CustomButton
              className="next-btn"
              label="Next"
              variant="contained"
            />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectedPrograms;
