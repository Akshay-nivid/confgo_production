import Grid from "@mui/material/Grid2";
import { EventRegistrationSuccessIcon } from "@/assets/svg";
import { Box, Typography } from "@mui/material";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { IStoreState } from "@/Libs/store";
import routes from "@/router/routes";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import QRCodeDisplay from "@/components/QRCodeDisplay/QRCodeDisplay";

const RegistrationCompleted = () => {

  const navigate = useNavigate();

  const finalPrice = useStore((state: any) => state?.compData?.["finalPrice"]?.value)
  const slugName = useStore((state: any) => state?.compData?.["slugName"]?.value)
  const orderData = useStore((state: IStoreState) => state?.compData?.["order"]?.["order"]?.data) || null
  const isCheckout = useStore((state: IStoreState) => state?.compData?.cartCheckout?.checkout) || false 
  const couponData = useStore((state: IStoreState) => state?.compData?.["couponData"]?.['coupon/applyCoupon']?.data) ?? null
  const regData = useStore((state: IStoreState) => state?.compData?.registrationCompleteData) || null
  
  // if (isCheckout === false) {

  //   if (!slugName) {

  //     const token = sessionStorage.getItem("token")
  //     if (!token) {
  //       return <Navigate to={routes.userLogin()} />;
  //     }
  //     return <Navigate to={routes.userHome()} />;
  //   }
  //   return <Navigate to={routes.eventExternalLink(slugName)} />
  // }

  return (
    <Grid container className="event-registration-completed">
      <Grid size={12} display={"flex"} justifyContent={"center"}>
        <EventRegistrationSuccessIcon className="registration-completed-icon" />
      </Grid>
      <Grid size={12} display={"flex"} justifyContent={"center"}>
        <Typography className="main-header">Registration Complete!</Typography>
      </Grid>
      <Grid
        className="sub-header-container"
        size={12}
        display={"flex"}
        justifyContent={"center"}
      >
        <Typography className="sub-header">
          {`You're officially registered for the ${regData?.event?.name ?? ''}!`}
        </Typography>
      </Grid>
      <Grid size={12} display={"flex"} justifyContent={"center"}>
        <Typography className="qr-header">Entry pass</Typography>
      </Grid>
      <Grid
        className="qr-code-container"
        size={12}
        display={"flex"}
        justifyContent={"center"}
      >
        <QRCodeDisplay value={regData?.participant?.qrCode} className="qr-code-display-section"/>
      </Grid>

      <Grid size={12}>
        <Box className="payment-bill-details-container">
          <Box className="payment-bill-details">
            <Box className="payment-bill-item">
              <Typography className="info-text">Programs Total</Typography>
              <Typography className="info-text">${orderData?.programTotal ?? 0}</Typography>
            </Box>
            <Box className="payment-bill-item">
              <Typography className="info-text">Food Total</Typography>
              <Typography className="info-text">${orderData?.addonTotal ?? 0}</Typography>
            </Box>
          </Box>
          <Box className="divider"></Box>
          <Box className="payment-bill-details">
            <Box className="payment-bill-item">
              <Typography className="info-text">Subtotal</Typography>
              <Typography className="info-text">${orderData?.subTotal ?? 0}</Typography>
            </Box>
             <Box className="payment-bill-item">
              <Typography className="info-text">Coupon Code Applied</Typography>
              <Typography className="info-text">${couponData?.discountAmount ?? 0 }</Typography>
            </Box>
          </Box>
          <Box className="divider"></Box>
          <Box className="payment-grand-total-container">
            <Typography className="grand-total-info-text">
              Grand Total
            </Typography>
            <Typography className="grand-total-info-text">
              $ {finalPrice ?? 0} </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={12} display={"flex"} justifyContent={"center"}>
        <CustomButton
          size="large"
          label="Back to Home"
          className="back-to-home-btn"
          onClick={() => {
            navigate(routes.userHome());
          }}
        />
      </Grid>
      <Grid size={12} className="note-container">
        <Typography className="note-text">Note:</Typography>
        <Typography className="note-description">
          Your event ticket has been sent to your registered email address.
          Please check your inbox (and spam folder) for the confirmation email,
          including your ticket and event details.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default RegistrationCompleted;
