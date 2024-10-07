import React from 'react';
import Button from '@mui/material/Button';

interface CustomButtonProps {
    onClick?: () => void;
    label: string;
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'default' | 'inherit' | 'primary' | 'secondary';
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    className?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;

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
}) => {
    return (
        <Button
            type={'submit'}
            startIcon={startIcon}
            endIcon={endIcon}
            className={className}
            onClick={onClick}
            variant={variant}
            disabled={disabled}
            size={size}
            fullWidth={fullWidth}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
