import CheckIcon from '@mui/icons-material/Check';

import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import {
  REGEX,
  validateConfirmPassword,
  validatePassword,
  validateRequiredField,
} from '@/Utils/Validation';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { LockIcon } from '@/assets/svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiClient from '@/Libs/Https/API-client';
import { Logger } from '@/Utils/Logger';
import useStore from '@/Libs/store';
import routes from '@/router/routes';

interface ISetPasswordForm {
  password: string;
  confirmPassword: string;
}

/**
 * User Set Password page component
 *
 */
const UserSetPassword = () => {
  const { control, handleSubmit, watch } = useForm<ISetPasswordForm>();
  const location = useLocation();
  const {userId,email} = location.state;
  console.log(userId,email,'userId,email')
  const [token,setToken] = useState<string>('');
  const setDataById = useStore((state: any) => state.setDataById)
  const navigate=useNavigate();
  useEffect(()=>{
    console.log(userId,email,'userId,email')
    getToken()
  },[])
  /**
   * function to get the token 
   */
  const getToken = async () => {
    try{
      const response = await apiClient.post('token', {userId,email,type:'USER_REGISTRATION'})
      if(response.data.status === 'success'){
        console.log(response.data.data.token,'response.data.token')
        setToken(response.data.data.token)
      }
      return response;
    }catch(error){
      Logger.error('User Set Password Error',error)
    }
 
  }
  /**
   * function to create the password
   * @param password 
   */
  const createPassword=async(password:string)=>{
    try{
      const requestBody={
        password:password,
        userId: userId,
        token: token,
        type:"USER_REGISTRATION",
        email:email,
      }
      const response=await apiClient.put(`user/setpassword`,requestBody);
      if(response.data.status==='success'){
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message:'Registration Successfully' })
        navigate(routes.userSetPasswordSuccessful());
      }else{
        setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:'Something went wrong' })
      }
    }
    catch(error:any){
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message:error.response.data.message})
    }
  }
  const handleLogin = async (data:ISetPasswordForm) => {
    createPassword(data.password);
  }

  const password = watch('password');
  return (
    <Grid
      justifyContent={'center'}
      alignItems={'center'}
      container
      className="user-setpassword"
    >
          <Grid size={12} className="content-container">
              <Box display={'flex'} justifyContent={'center'}>
              <LockIcon className="lock-icon" />
              
              </Box>
        <Box className="header-container">
          <Typography textAlign={'center'} className="header-title">
            Set Password
          </Typography>
          <Typography textAlign={'center'} className="header-subtitle">
            Your new password must be different to <br /> previously used
            passwords.
          </Typography>
        </Box>
        <Box className="form-container">
          <form
            onSubmit={handleSubmit(handleLogin)}
            noValidate
            className="form"
          >
            <Box
              className="textfield-container"
              display={'flex'}
              flexDirection={'column'}
            >
              <CustomTextField
                control={control}
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
                rules={{
                  required: validateRequiredField({ fieldName: 'Password' }),
                  // minLength: validateMinLength({ fieldName: 'Password', minLength: 8 }),
                  pattern: validatePassword({}),
                }}
              />
              <CustomTextField
                control={control}
                name="confirmPassword"
                placeholder="Confirm Password"
                label="Confirm Password"
                type="password"
                rules={{
                  required: validateRequiredField({
                    fieldName: 'Confirm Password',
                  }),
                  validate: (value) =>
                    validateConfirmPassword({
                      password: password,
                      confirmPassword: value,
                    }),
                }}
              />
            </Box>
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={1.5}
              className="setpassword__requirements"
            >
              <Box
                display={'flex'}
                gap={1}
                alignItems={'center'}
                className="setpassword__requirement"
              >
                <CheckIcon
                  className={clsx('setpassword__check-icon', {
                    'active': password?.length >= 8,
                  })}
                />
                <Typography className="setpassword__requirement-text text-p2 font-400">
                  Must be at least 8 characters long
                </Typography>
              </Box>
              <Box
                display={'flex'}
                gap={1}
                alignItems={'center'}
                className="setpassword__requirement"
              >
                <CheckIcon
                  className={clsx('setpassword__check-icon ', {
                    'active': REGEX.PASSWORD_REGEX.test(password),
                  })}
                />
                <Typography className="setpassword__requirement-text text-p2 font-400">
                  Must contain one special character
                </Typography>
              </Box>
            </Box>
            <CustomButton
              className="login-button"
              fullWidth
              size="large"
              label="Reset Password"
              type="submit"
            />
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserSetPassword;
