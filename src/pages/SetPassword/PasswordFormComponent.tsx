import {  Box, Button, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import Grid from '@mui/material/Grid2';
import CheckIcon from '@mui/icons-material/Check';
import clsx from 'clsx';
import { validateConfirmPassword, validateMinLength, validatePassword, validateRequiredField } from '@/Utils/Validation';
import { REGEX } from '@/Utils/Validation';
import apiClient from '@/Libs/Https/API-client';
import useStore from '@/Libs/store';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
/**
 * Component use to set password
 * @returns
 */

const SetPasswordComponent = () => {
  const setDataById = useStore((state: any) => state.setDataById)
  const navigate=useNavigate();
  type FormData = {
    confirmPassword: string;
    password: string;
  };
  /**
   * function react hook form
   */
  const { handleSubmit,control,watch } = useForm<FormData>({
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
    createPassword(data.password);
  };
  /**
   * function used to create password
   * @param password 
   */
  const createPassword=async(password:string)=>{
    try{
      const requestBody={
        password:password,
        userId: userDetails.data.userId,
        token: userDetails.data.token,
        type:"USER_REGISTRATION",
        email:userDetails.data.email,
      }
      const response=await apiClient.put(`user/setpassword`,requestBody);
      if(response.data.status==='success'){
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message:'Registration Successfully' })
        navigate(routes.LoginOrg());
      }else{
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:'Something went wrong' })
      }
    }
    catch(error:any){
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:error.response.data.message})
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
            <Typography className="setpassword__input-label text-p2 font-500">
              Password
            </Typography>
            <CustomTextField
              control={control}
              name="password"
              rules={{
                required: validateRequiredField({fieldName:'Password'}),
                minLength: validateMinLength({fieldName:'Password',minLength:8}),
                pattern:validatePassword({})
              }}
              type="password"
              placeholder="Password"
              className="setpassword__input"
            />
          </Box>
          <Box className="setpassword__input-container">
            <Typography className="setpassword__input-label text-p2 font-500">
              Confirm Password
            </Typography>
            <CustomTextField
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              control={control}
              rules={{
                required: validateRequiredField({fieldName:'Confirm Password'}),
                validate:(value)=> validateConfirmPassword({password,confirmPassword:value})
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
                'active': password.length >= 8,
              })} />
              <Typography className="setpassword__requirement-text text-p2 font-400">Must be at least 8 characters long</Typography>
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
          <Button
            type="submit"
            variant="contained"
            className="setpassword__submit-button w-full custom-button text-p1 font-600"
          >
            Set Password
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default SetPasswordComponent;
