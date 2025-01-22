import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
import CustomDatePicker from "@/components/CustomDatePicker/CustomDatePicker";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import moment from "moment";
import CustomButton from "@/components/CustomButton/CustomButton";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CustomSnackbar from "@/components/CustomSnackbar/CustomSnackbar";
import routes from "@/router/routes";
import useStore from '@/Libs/store'
import { validateMaxLength, validateMinLength } from "@/Utils/Validation";

/**
 * Coupon Details Page
 * @author Neethu
 */
const CouponView: React.FC = () => {
  const { handleSubmit,getValues, control,reset,watch} = useForm<any>();
  const { id } = useParams<{ id: string }>(); // Retrieve the ID from URL parameters
  const [coupon, setCoupon] = useState<Coupon | null>(null); // Replace 'Coupon' with your actual coupon type
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error message
  const [editable, setEditable] = useState<boolean | null>(false); // State for error message
  const setDataById = useStore((state: any) => state.setDataById);
  interface Coupon {
    name: string;
    description: string;
    code: string;
    startDate: Date; // You may want to use Date type
    endDate: Date; // You may want to use Date type
    discountType: string;
    discountValue: number;
    maxUses: number;
    maxDiscountValue: number;
    minPurchaseValue: number;
  }
  const [ViewStartDate,setViewStartDate]=useState<string>()
  const [ViewEndDate,setViewEndDate]=useState<string>()
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const navigate = useNavigate();
  /**
   * useEffect hook to handle the API call
   */
  useEffect(() => {
    fetchCoupon();
  }, [id, reset]);

  const watchDistype=watch('discountType');
  /**
   * Fetch Coupon Details
   */
  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/coupon/${id}`); // Adjust the endpoint as needed
      const { status, data } = await processAPIResponse(response, "Viewcoupon");
      if (status) {
        setCoupon(data);
        reset({
          ...data,
          startDate: moment(data.startDate).format("YYYY-MM-DD"),
          endDate: moment(data.endDate).format("YYYY-MM-DD"),
        });
        setViewStartDate(moment(data.startDate).format("YYYY-MM-DD"))
        setViewEndDate( moment(data.endDate).format("YYYY-MM-DD"))       
      }
    } catch (err) {
      setError("Failed to fetch coupon details."); // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  /**
   * save edited coupon
   */
  const updateCouponDetails = async () => {

    /**
     * Validate that the start date is not a past date.
     * Ensures the 'startDate' is greater than or equal to the current date.
     */
    const startDate = new Date(getValues('startDate'))
    const endDate=new Date(getValues('endDate'))
    const currentDate = new Date()
    startDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0); 
    if(startDate < currentDate){
      setDataById('snackBarInfo',
        { open: true, autoHideDuration: 3000, severity: 'error',
        message: "Start Date must be greater than the current date."})
          return;
    }
    if (endDate < startDate) {
      setDataById('snackBarInfo', {
        open: true,
        autoHideDuration: 3000, 
        severity: 'error',
        message: "End Date must be greater than or equal to the Start Date.", // Error message
      });
      return;
    }
    
    try {
      setLoading(true);
      if (!coupon) {
        return;
      }

      // Compare and filter only updated values
      const updatedFields: Partial<Coupon> = {};
      Object.keys(coupon!).forEach((key) => {
        if (coupon[key as keyof Coupon] !== getValues(key as keyof Coupon)) {
          updatedFields[key as keyof Coupon] = getValues(key as keyof Coupon);
        }
      });

      if (Object.keys(updatedFields).length > 0) {
        const response = await apiClient.put(`/coupon/${id}`, updatedFields); // Only send updated fields
        const { status } = await processAPIResponse(response, "Viewcoupon");
        if (status) {
          setEditable(false);
          setSnackbarOpen(true);
          setSnackbarMessage("Coupon Updated Successfully");
          setSnackbarSeverity("success");

          setTimeout(() => {
            navigate(routes.coupon()); // Redirect to the coupon list
          }, 1500);
        }
      }
     
    } catch (err) {
      setError("Failed to update coupon details.");
     
    } finally {
      setLoading(false);
    }
  };

  /**
   * Function to restore form data to its original state.
   */
  const restore = () => {
    if (coupon) {
      const formattedOriginalData = {
        ...coupon,
        startTime: moment(coupon.startDate).format("YYYY-MM-DDTHH:mm"),
        endTime: moment(coupon.endDate).format("YYYY-MM-DDTHH:mm"),
      };
      reset(formattedOriginalData);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Snackbar for displaying errors
  const handleCloseSnackbar = () => {
    setError(null);
  };
  const discountTypeOptions = [
    { value: "percentage", label: "Percentage" },
    { value: "flat", label: "Flat Rate" },
  ];
  return (
    <>
      <Box className="create-coupon-container">
        <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        />
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
        ) : (
          <Grid
            container
            size={{ xs: 12, sm: 12 }}
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            <Grid size={{ xs: 12, sm: 6 }} className="create-coupon-grid">
              <Grid size={{ xs: 12, sm: 12 }}>
                <CustomButton
                  className="custom-list-edit-btn"
                  label="Edit"
                  variant="contained"
                  size="large"
                  type="submit"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setEditable(true);
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <Typography
                  textAlign={"center"}
                  lineHeight={2}
                  className="create-coupon-title"
                >
                  Coupon
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }} className="create-coupon-form">
                <form onSubmit={handleSubmit(()=>updateCouponDetails())}>
                  <Grid
                    container
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name="name"
                        placeholder="Coupon Name"
                        control={control}
                        defaultValue={coupon?.name}
                        rules={{ required: "Coupon Name is required" }}
                        disabled={!editable}
                        readOnly={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name="code"
                        placeholder="Coupon Code"
                        control={control}
                        defaultValue={coupon?.code}
                        rules={{
                          required:{value:true,message:"Coupon Code is required"},
                          minLength: validateMinLength({minLength: 6, fieldName: "Coupon Code"}),
                          maxLength: validateMaxLength({maxLength: 8, fieldName: "Coupon Code"}),
                        }}
                        requiredField
                        disabled={!editable}
                        readOnly={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomSelect
                        name="discountType"
                        label="Discount Type"
                        defaultValue={coupon?.discountType}
                        control={control}
                        options={discountTypeOptions}
                        fullWidth
                        disabled={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name="discountValue"
                        placeholder={watchDistype==="percentage"?"Discount Percent":"Discount Value"}
                        control={control}
                        rules={{ required: "Discount Value is required" }}
                        type="number"
                        defaultValue={coupon?.discountValue}
                        requiredField
                        disabled={!editable}
                        readOnly={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomDatePicker
                        placeholder="Start Date"
                        name="startDate"
                        control={control}
                        defaultValue={ViewStartDate}
                        min={moment().format("YYYY-MM-DD")}
                        rules={{ required: "Start Date is required" }}
                        label="Start Date"
                        requiredField
                        disabled={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomDatePicker
                        placeholder="Expiry Date"
                        name="endDate"
                        defaultValue={ViewEndDate}
                        control={control}
                        min={moment().format("YYYY-MM-DD")}
                        rules={{ required: "Expiry Date is required" }}
                        label="End Date"
                        requiredField
                        disabled={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name="maxUses"
                        placeholder="Maximum Usage"
                        control={control}
                        type="number"
                        defaultValue={coupon?.maxUses}
                        requiredField
                        disabled={!editable}
                        readOnly={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <CustomTextField
                        name="maxDiscountValue"
                        placeholder="Maximum Discount Amount"
                        prefix="$"
                        control={control}
                        defaultValue={coupon?.maxDiscountValue}
                        type="number"
                        requiredField
                        disabled={!editable}
                        readOnly={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomTextField
                        name="minPurchaseValue"
                        prefix="$"
                        placeholder="Minimum Purchase Amount"
                        control={control}
                        type="number"
                        requiredField
                        disabled={!editable}
                        defaultValue={coupon?.minPurchaseValue}
                        readOnly={!editable}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomTextField
                        name="description"
                        multiline={true}
                        rows={4}
                        defaultValue={coupon?.description}
                        placeholder="Description"
                        control={control}
                        disabled={!editable}
                        readOnly={!editable}
                      />
                    </Grid>
                  </Grid>
                  {editable ? (
                    <Grid size={{ xs: 12, sm: 12 }}>
                      <CustomButton
                        className="custom-list-save-btn"
                        label="Save"
                        variant="contained"
                        size="large"
                        type="submit"
                        startIcon={<SaveIcon />}
                      />
                       <CustomButton
                        className="custom-list-save-btn custom-list-restore-btn"
                        label="Cancel"
                        variant="outlined"
                        size="large"
                        onClick={restore}
                      />
                    </Grid>
                    
                  ) : (
                    ""
                  )}
                </form>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default CouponView;
