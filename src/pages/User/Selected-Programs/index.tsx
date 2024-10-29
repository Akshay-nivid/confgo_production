import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { CouponIcon } from "@/assets/svg";
const SelectedPrograms = () => {
  const { control } = useForm();
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

        <Grid size={12} className="">
          {Array.from({ length: 1 }).map((_, index) => (
            <Box key={index} className="selected-program-card-wrapper">
              <Box className="selected-program-card-content">
                <Typography className="sub-header">
                  Day 1 – May 10, 2024
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
                      { label: "Program 1", value: "program1", checked: true },
                      { label: "Program 2", value: "program2", checked: true },
                      { label: "Program 3", value: "program3", checked: true },
                    ]}
                  />
                </Box>
                <Typography className="sub-header">Food Selection:</Typography>
                <Box>
                  <CustomCheckbox
                    control={control}
                    className="food-list-item-checkbox"
                    id="program"
                    name="program"
                    row="vertical"
                    data={[
                      { label: "Program 1", value: "program1", checked: true },
                      { label: "Program 2", value: "program2", checked: true },
                      { label: "Program 3", value: "program3", checked: true },
                    ]}
                  />
                </Box>
              </Box>

              <Box className="divider "></Box>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                className="subtotal-container"
              >
                <Typography className="total-text">
                  Subtotal for Day 1
                </Typography>
                <Typography className="total-text">$315</Typography>
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
