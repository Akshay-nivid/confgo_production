import CheckIcon from '@mui/icons-material/Check';

import CustomButton from '@/components/CustomButton/CustomButton';
import CustomTextField from '@/components/CustomTextfield/CustomTextField';
import {
  REGEX,
  validateConfirmPassword,
  validatePassword,
  validateRequiredField,
} from '@/Utils/Validation';
import { IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { POST, setDataById } from '@/Libs/store';
import CloseOutlined from '@mui/icons-material/CloseOutlined';


interface IChangePasswordProps {
  successCB?: () => void;
  closeDrawer: () => void;
  className?: string;
}
interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

/**
 * ChangePassword Component - Allows users to update their password.
 */
const ChangePassword: React.FC<IChangePasswordProps> = ({ successCB, closeDrawer }) => {
  const { handleSubmit, control, watch } = useForm<IChangePasswordData>();
  const newPassword = watch('newPassword');
  /**
   * Sends a request to update the user's password.
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<void>}
   */
  const createNewPassword = async (currentPassword: string, newPassword: string) => {
    try {
      const body = {
        currentPassword: currentPassword,
        newPassword: newPassword
      }
      POST({
        url: `user/changePassword`,
        body: body,
        id: 'changePassword',
        successCB: (_success: any) => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "success",
            message: "Password Changed",
          });
          successCB && successCB();
          closeDrawer && closeDrawer();
        },
        errorCB: (error: any) => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: error?.message,
          })
        }
      });
    }
    catch (error: any) {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: error?.message })
    }
  }
  
  /**
   * Handles form submission for changing the password.
   * @param {IChangePasswordData} data - Form data containing passwords
   * @returns {Promise<void>}
   */
  const handleChangePassword = async (data: IChangePasswordData) => {

    if (data.newPassword === data.confirmNewPassword) {
      createNewPassword(data.currentPassword, data.newPassword);
    } else {
      setDataById('snackBarInfo', { open: true, autoHideDuration: 1000, severity: 'error', message: 'Passwords do not match' })
    }

  }
  return (
    <Grid className={"change-password-drawer"}>
      <Grid
        justifyContent={'center'}
        alignItems={'center'}
        container
        className="user-setpassword"
      >
        <Grid size={{ xs: 12 }}>
          <Grid container rowSpacing={4} justifyContent="space-between" alignItems="center" size={{ xs: 12 }} p={{ xs: 3 }}>
            <Typography className="event-information-edit-heading">
              Change Password
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Box className="form-container" pl={{ xs: 4 }} pr={{ xs: 4 }}>
            <form onSubmit={handleSubmit(handleChangePassword)} className="form">
              <Box
                className="textfield-container"
                display={'flex'}
                flexDirection={'column'}
              >
                <CustomTextField
                  control={control}
                  name="currentPassword"
                  placeholder="Current Password"
                  label="Current Password"
                  type="password"
                  rules={{
                    required: validateRequiredField({ fieldName: 'currentPassword' }),
                  }}
                />
                <CustomTextField
                  control={control}
                  name="newPassword"
                  placeholder="New Password"
                  label="New Password"
                  type="password"
                  rules={{
                    required: validateRequiredField({ fieldName: 'New Password' }),
                    pattern: validatePassword({}),
                  }}
                />
                <CustomTextField
                  control={control}
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  label="Confirm New Password"
                  type="password"
                  rules={{
                    required: validateRequiredField({
                      fieldName: 'Confirm New Password',
                    }),
                    validate: (value) =>
                      validateConfirmPassword({ password: newPassword, confirmPassword: value }),
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
                    className={clsx('setpassword__check-icon ', {
                      'active': REGEX.PASSWORD_REGEX_UPP.test(newPassword),
                    })}
                  />
                  <Typography className="setpassword__requirement-text text-p2 font-400">
                    New password must contain one Upper case letter
                  </Typography>
                </Box>
                <Box
                  display={'flex'}
                  gap={1}
                  alignItems={'center'}
                  className="setpassword__requirement"
                >
                  <CheckIcon
                    className={clsx('setpassword__check-icon', {
                      'active': newPassword?.length >= 8,
                    })}
                  />
                  <Typography className="setpassword__requirement-text text-p2 font-400">
                    New password must be ateast 8 characters long
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
                      'active': REGEX.PASSWORD_REGEX.test(newPassword),
                    })}
                  />
                  <Typography className="setpassword__requirement-text text-p2 font-400">
                    New password must contain atleast one special character
                  </Typography>
                </Box>
              </Box>
              <CustomButton
                fullWidth
                size="large"
                label="Update Password"
                type="submit"
              />
            </form>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
