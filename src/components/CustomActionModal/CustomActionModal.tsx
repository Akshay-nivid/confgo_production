import React from 'react';
import Grid from "@mui/material/Grid2";
import { Dialog, DialogActions, IconButton, Typography } from "@mui/material";
import CustomButton from '../CustomButton/CustomButton';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';

interface CustomActionModalProps {
    icon?: React.ReactNode;
    header?: string;
    subHeader?: string;
    submitAction: () => void;
    cancelAction: () => void;
    open: boolean; // Whether the modal is open
    onClose: () => void; // Function to close the modal
    cancelLabel: string;
    submitLabel: string;
    modalClassName?: string;

}
/**
 * compoent for custom modal 
 */
const CustomActionModal: React.FC<CustomActionModalProps> = ({
    icon,
    header,
    subHeader,
    submitAction,
    cancelAction,
    cancelLabel,
    submitLabel,
    open,
    onClose,
    modalClassName,
}) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <Grid container spacing={1} direction="column" alignItems="center" className={clsx("action-modal",modalClassName)}>
                <Grid size={12} container justifyContent={"flex-end"} alignContent={"flex-end"}>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
                {/* Icon Section */}
                <Grid container justifyContent={"center"} alignContent={"center"}>
                    {icon}
                </Grid>
                {/* Header Section */}
                <Grid justifyContent={"center"} alignContent={"center"}>
                    <Typography className={clsx('action-modal-header')} >{header}</Typography>
                </Grid >
                {/* Subheader Section */}
                <Grid container justifyContent={"center"} alignContent={"center"}>
                    <Typography className={clsx('action-modal-sub-header')}>{subHeader}</Typography>
                </Grid>
                {/* Button Section */}
                <DialogActions>
                    <CustomButton
                        label={cancelLabel}
                        className={clsx("action-modal-btn-cancel")}
                        onClick={cancelAction}
                    />
                    <CustomButton
                        label={submitLabel}
                        className={clsx('action-modal-btn-ok')}
                        onClick={submitAction}
                    />
                </DialogActions>
            </Grid>
        </Dialog>
    );
};

export default CustomActionModal;
