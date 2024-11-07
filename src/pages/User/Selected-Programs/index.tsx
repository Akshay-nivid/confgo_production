import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import { CouponIcon } from "@/assets/svg";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useStore from "@/Libs/store";
import routes from "@/router/routes";
import { useEffect } from "react";

/**
 * Compoennt used to render selected program
 */
const SelectedPrograms = () => {

  const { control, setValue, reset } = useForm();
  const eventDetails = useStore((state: any) => state?.compData?.["eventDetails"]) ?? '';
  const navigate = useNavigate();

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
          {eventDetails.selectedDetails && Object.entries(eventDetails?.selectedDetails).map(([date, data]: any, index: number) => (
            <>
              {Object.keys(data).length !== 0 && <Grid
                width={"100%"}
                key={index}
                className="selected-program-card-wrapper"
              >
                <Grid className="selected-program-card-content">
                  <Typography className="sub-header">
                    Day {index + 1} -
                    {moment(date).format("MMM DD, YYYY")}
                  </Typography>
                  <Typography className="sub-header">
                    Programs Selected:
                  </Typography>
                  {data?.programs?.length > 0 && data?.programs?.map((item: any) => (
                    <Grid container direction={'row'} className="program-list-container">
                      <Grid>
                        <CustomCheckbox
                          control={control}
                          className="program-list-item-checkbox"
                          id="program"
                          name={`${date}-programs`}
                          setValue={setValue}
                          options={[
                            { label: item.name, value: item.id },
                          ]}
                        />
                      </Grid>
                      <Grid size={6} alignItems={'center'} display={'flex'}>- {moment(date).format("h:mm A")} - ${item?.amount}</Grid>
                    </Grid>
                  ))}
                  {data?.addons?.length > 0 && (
                    <Grid container size={12} direction={'row'} className="add-on-list-container">
                      {data?.addons?.map((addon: any) => (
                        <Grid>
                          <Grid className="select-add-on-text">Food Selection:</Grid>
                          <Grid key={index} className="add-on-list-item">
                            <CustomCheckbox
                              control={control}
                              className="add-on-list-item-checkbox "
                              id={addon.addonId}
                              name={`${date}-addons`}
                              label={addon.title}
                              setValue={setValue}
                              options={[
                                {
                                  label: addon.name,
                                  value: addon.addonId,
                                },
                              ]}
                            />
                            <Grid size={6}>- ${addon?.amount}</Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Grid>
                <Grid className="divider "></Grid>
                <Grid
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  className="subtotal-container"
                >
                  <Typography className="total-text">
                    Subtotal for Day {index + 1}
                  </Typography>
                  <Typography className="total-text">
                    {/* $ {program.amount} */}
                  </Typography>
                </Grid>
              </Grid>}
            </>
          ))}
          <Grid className="coupon-container">
            <Typography className="coupon-header-text">
              Apply Coupons
            </Typography>
            <Grid container columnSpacing={3}>
              <Grid size={8}>
                <CustomTextField
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
          </Grid>
          <Grid className="grand-total-container">
            <Typography className="total-text">Grand Total</Typography>
            <Typography className="total-text">$315</Typography>
          </Grid>

          <Grid className="navigation-btn-group-container">
            <CustomButton
              className="back-btn"
              label="Back"
              variant="outlined"
              onClick={() => navigate(routes.programSelection())}
            />
            <CustomButton
              className="next-btn"
              label="Next"
              variant="contained"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectedPrograms;
