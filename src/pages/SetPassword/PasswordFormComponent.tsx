import {  Box, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import Grid from '@mui/material/Grid2';
import CheckIcon from '@mui/icons-material/Check';
import clsx from 'clsx';
import { validateMinLength, validatePassword, validateRequiredField } from '@/Utils/Validation';
import { REGEX } from '@/Utils/Validation';
import useStore from '@/Libs/store';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import { Logger } from '@/Utils/Logger';
import CustomButton from '@/components/CustomButton/CustomButton';
/**
 * Component use to set password
 * @returns
 */

const SetPasswordComponent = () => {
  const setDataById = useStore((state: any) => state.setDataById)
  const PUT = useStore((state: any) => state.PUT);
  const navigate=useNavigate();
  type FormData = {
    confirmPassword: string;
    password: string;
  };
  /**
   * function react hook form
   */
  const { handleSubmit,control,watch , trigger} = useForm<FormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });


  const password = watch('password');

  const userDetails = useStore((state: any) => state?.compData?.['userDataRegister']) ?? [];
  /**
   * function used to handle form submission
   */
  const onSubmit: SubmitHandler<FormData> = (data) => {
    if(data.password===data.confirmPassword){
      createPassword(data.password);
    }else{
      setDataById('snackBarInfo', { open: true, autoHideDuration: 1000, severity: 'error', message:'both password should be same' })
    }
    
  };
  /**
   * function used to create password
   * @param password 
   */
  const createPassword = async (password: string) => {
    try {
      const body = {
        password:password,
        userId: userDetails?.data?.userId,
        token: userDetails?.data?.token,
        type:userDetails?.data?.tokenType==="RESET_PASSWORD_OTP"?"FORGOT_PASSWORD_OTP":userDetails?.data?.tokenType,
        email:userDetails?.data?.email,
      };
      await PUT({
        url: `user/setpassword`,
        body: body,
        id: 'userSetPassword',
        successCB: (_success: any) => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message:'Registration Successfully' })
        navigate(routes.loginOrg());
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
    <Grid container size={12} className="setpassword">
      <Grid size={12} className="setpassword__header-wrapper">
        <Typography textAlign={'center'} className="setpassword__header-title text-h4 font-600">
          Set Password
        </Typography>
        <Typography
          textAlign={'center'}
          className="setpassword__header-description text-p2 font-400"
        >
          Your new password must be different to <br /> previously used
          passwords.
        </Typography>
      </Grid>
      <Grid size={12} className="setpassword__form-wrapper">
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="setpassword__form"
        >
          <Box className="setpassword__input-container">
            <CustomTextField
              control={control}
              name="password"
              rules={{
                required: validateRequiredField({fieldName:'Password'}),
                minLength: validateMinLength({fieldName:'Password',minLength:8}),
              
                pattern:validatePassword({}),
                validate: () => {
                  trigger('confirmPassword');
                  return true;
              },
              }}
              type="password"
              placeholder="Password"
              className="setpassword__input"
            />
          </Box>
          <Box className="setpassword__input-container confirmpasswordbox">
            <CustomTextField
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              control={control}
              rules={{
                required: validateRequiredField({fieldName:'Confirm Password'}),
                validate: (value: any) => {
                  if (value === watch("password")) {
                      return true;
                  } else {
                      return "The passwords do not match";
                  }
              }
              }}
              
              className="setpassword__input"
            />
          </Box>

          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'1rem'}
            marginBottom={'1rem'}
            className="setpassword__requirements"
          >
            <Box display={'flex'} gap={1} alignItems={'center'} className="setpassword__requirement">
              <CheckIcon className={clsx("setpassword__check-icon", {
                'active': password.length >= 8 &&password?.length<=16,
              })} />
              <Typography className="setpassword__requirement-text text-p2 font-400">Must be between 8 and 16 characters long</Typography>
            </Box>
            <Box display={'flex'} gap={1} alignItems={'center'} className="setpassword__requirement">
              <CheckIcon className={clsx("setpassword__check-icon ", {
                'active': REGEX.PASSWORD_REGEX.test(password),
              })} />
              <Typography className="setpassword__requirement-text text-p2 font-400">Must contain one special character</Typography>
            </Box>
            <Box display={'flex'} gap={1} alignItems={'center'} className="setpassword__requirement">
              <CheckIcon className={clsx("setpassword__check-icon ", {
                'active': REGEX.PASSWORD_REGEX_UPP.test(password),
              })} />
              <Typography className="setpassword__requirement-text text-p2 font-400">Must contain one Upper case letter</Typography>
            </Box>
          </Box>
           <CustomButton
              label="Set Password"
              type="submit"
              fullWidth
              className={clsx('custom-button')}
            />
        </form>
      </Grid>
    </Grid>
  );
};

export default SetPasswordComponent;
