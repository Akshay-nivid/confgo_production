import React from 'react';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

interface CustomButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  label: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'default' | 'inherit' | 'primary' | 'secondary';
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: 'button' | 'submit';
  isLoading?: boolean;
}

/**
 * Component used to render button
 * @param param
 * @returns
 */
const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  label,
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
  disabled,
  className,
  startIcon,
  endIcon,
  type,
  isLoading=false
}) => {
  return (
    <Button
      type={type || 'button'}
      startIcon={startIcon}
      endIcon={endIcon}
      className={clsx(className ,'padding-top-button')}
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      {label}
      {isLoading ?<CircularProgress className='circular-progress ml-2' color='inherit' size={18}/>:<></>}
    </Button>
  );
};

export default CustomButton;
