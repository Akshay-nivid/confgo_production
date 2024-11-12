import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./accountsetting.scss";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { purposeTypes } from "@/Utils/CommonBaseClass";

export const userType = {
  PARTICIPANT: 'PARTICIPANT',
  ORGANISATION: 'ORGANIZATION'
}

interface SecurityProps {
  email: string; 
}

const Security: React.FC<SecurityProps> = ({ email }) => {
  const POST = useStore((state: any) => state.POST);

  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    const body = { username: email, };

    const successCB = (context: any) => {
    
        navigate(routes.userOtp(), { state: { email, purpose: purposeTypes.RESET_PASSWORD, token: context?.data?.token?.token, userId: context?.data?.token?.userId  } });
            
    };

    POST({
      url: 'user/forgotPassword', body: body,
      id: 'forgotPassword',
      successCB: successCB,
      errorCB: (error: any) => Logger.error("error", error)
    })
    
  };


  return (
    <Grid container>
      <Grid size={12}>
        <Typography className="security-title account-title">Security</Typography>
      </Grid>

      <Grid
        container
        size={10}
        className="security-text-border"
      >
        <Grid>
          <Typography className="security-text">
            Email Address
          </Typography>
          <Typography className="security-subtext">
            The email associated with your Account
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <Typography className="security-text">
            {email}
          </Typography>
          
        </Grid>
      </Grid>

      <Grid
        container
        size={10}
         className="security-text-border"
      >
        <Grid>
          <Typography className="security-text">
            Password
          </Typography>
          <Typography  className="security-subtext">
            Set a unique password to protect your account
          </Typography>
        </Grid>
        <Grid display="flex" alignItems="center">
          <CustomButton
            className="security-password-reset-btn"
            label="Reset Password"
            variant="contained"
            onClick={handlePasswordReset}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Security;
