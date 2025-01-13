import { Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import Grid from '@mui/material/Grid2';
import { Controller } from 'react-hook-form';
import { validateMinLength, validateRequiredField } from '@/Utils/Validation';
import { useEffect, useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import useStore from '@/Libs/store';
import { Logger } from '@/Utils/Logger';
import CustomButton from '@/components/CustomButton/CustomButton';
import clsx from 'clsx';
import CustomTimer from '@/components/CustomTimer/CustomTimer';

/**
 * component used to verify the otp
 */

interface OtpComponentProps {
  onOtpVerify: (status: boolean) => void;
}
interface otpDataFields{
  otp:string,
  token:string,
  type:string
}
const OtpComponent: React.FC<OtpComponentProps> = ({onOtpVerify}) => {
  const { setDataById }: any = useStore();
  const userDetails = useStore((state: any) => state?.compData?.['userDataRegister']) ?? [];
  const [userData, setUserData] = useState<any>(null);
  const [otpData,setOtpData]=useState<otpDataFields>();
  const POST = useStore((state: any) => state.POST);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  type FormData = {
    otp: string;
  };
  /**
   * useEffect hook used to get user by id
   */
  useEffect(() => {
    getUserById();

  }, [])


  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { otp: '' },
  });

  /**
   * otp form submit handler
   */
  const onSubmit: SubmitHandler<FormData> = (data) => {
    verifyOtp(data.otp);
  };
  /**
   * function used to get user by id
   */
  const getUserById = async () => {
    try {
      const requestBody = {
        userId: userDetails.data.userId,
        token: userDetails.data.token,
        type:userDetails?.data?.tokenType??'COMPANY_REGISTRATION'

      }
      const response = await apiClient.post(`user/details`, requestBody)
      if (response.data.status === 'success') {
        setDataById('userDataRegister', { data:{userId:userDetails.data.userId,token:userDetails.data.token,email:response.data.data.email,phone:response.data.data.phone,tokenType:userDetails?.data?.tokenType==="FORGOT_PASSWORD_OTP"?"RESET_PASSWORD_OTP":userDetails?.data?.tokenType} });
        getOtp(response.data.data.phone);
        setUserData(response.data.data);
      }else{
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:'Something went wrong' })
      }
    } catch (error:any) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:'failed' })
      Logger.error(error,'OtpFormComponent.tsx')
    }
  }
  /**
   * function used to get otp
   * @param phone 
   */

  const getOtp = async (phone: string) => {
    try {
      const requestBody = {
        phone: userData?.phone ?? phone,
        type:userDetails?.data?.tokenType==="FORGOT_PASSWORD_OTP"?"RESET_PASSWORD_OTP":userDetails?.data?.tokenType

      }
      const response = await apiClient.post(`token/otp`, requestBody)
      if (response.data.status === 'success') {
        setOtpData(
          {otp:response.data.data.otp,token:response.data.data.token,type:response.data.data.type}
        )
        setIsResendDisabled(true)
      }else{
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:response.data.message })
      }
    } catch (error:any) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:error.response.data.message })
      Logger.error(error,'OtpFormComponent.tsx')
    }
  };

  /**
   * function used to verify otp
   * @param otp 
   */
    const verifyOtp = async (otp: string) => {
      try {
        const body = {
          userId: userDetails.data.userId,
          token: otpData?.token,
          otp: otp,
          type: otpData?.type,
        };
        await POST({
          url: `token/validateotp`,
          body: body,
          id: 'otpVerify',
          successCB: (_success: any) => {
            onOtpVerify(true);
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "success",
              message: "Otp verified successfully",
            });
          },
          errorCB: (error: any) => {
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "error",
              message: error.message,
            })
          }
        });
      } catch (error) {
        Logger.error('OtpFormCompoent.tsx', error)
      }
    }
  return (
    <Grid  size={12} container className="otpcomponent__content-wrapper">
      <Grid size={12} className="otpcomponent__header-wrapper">
        <Typography textAlign={'center'} className="otpcomponent__header-title">
          Verify Your Account
        </Typography>
        <Typography
          textAlign={'center'}
          className="otpcomponent__header-description "
        >
          Enter the OTP sent to {userData?.phone} <br /> to complete
          the process.
        </Typography>
      </Grid>
      <Grid size={12} className="otpcomponent__form-wrapper">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="form">
          <Grid className="otpcomponent__otp-input-container">
            <Controller
              name="otp"
              control={control}
              rules={{
                required: validateRequiredField({ fieldName: 'OTP' }),
                minLength: validateMinLength({
                  message: 'Invalid OTP',
                  minLength: 6,
                }),
              }}
              render={({ field }) => (
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
                  numInputs={6}
                  shouldAutoFocus
                  renderInput={(props) => (
                    <input
                      {...field}
                      {...props}
                      className="otpcomponent__otp-input-container-otp-input"
                      onKeyDown={(e) => {
                        if (e.key !== 'Backspace' && isNaN(Number(e.key))) {
                          e.preventDefault();
                        }
                      }}
                    />
                  )}
                  containerStyle={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                />
              )}
            />

            {errors.otp?.message && (
              <Typography className="otpcomponent__error-text">
                {errors.otp.message}
              </Typography>
            )}
          </Grid>

            <CustomButton
              label="Verify"
              type="submit"
              fullWidth
              className={clsx('custom-button')}
            />
        </form>
      </Grid>
      <Grid
        display={'flex'}
        justifyContent={'center'}
        size={12}
        className="otpcomponent__already-have-account-link-wrapper"
      >
        <Typography
          textAlign={'center'}
          className="otpcomponent__already-have-account-text"
        >
          Didn't receive the code?
          {!isResendDisabled &&
          <span onClick={() => { getOtp(userData.phone) }} className="otpcomponent__signup-now-text">
            Resend OTP
          </span>
      }
      <CustomTimer
          initialTime={180}
          isResendDisabled={isResendDisabled}
          setIsResendDisabled={setIsResendDisabled}
          className='otpcomponent__signup-now-text'
          />
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OtpComponent;
