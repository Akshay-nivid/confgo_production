import React from 'react';
import Button from '@mui/material/Button';

interface CustomStepperButtonProps {
    onClick?: () => void;
    label: string;
    // variant?: 'text' | 'outlined' | 'contained';
    // color?: 'default' | 'inherit' | 'primary' | 'secondary';
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    className?: string;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;

}

const CustomStepperButton: React.FC<CustomStepperButtonProps> = ({
    onClick,
    label,
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
            disabled={disabled}
            size={size}
            fullWidth={fullWidth}>
            {label}
        </Button>
    );
};

export default CustomStepperButton;
