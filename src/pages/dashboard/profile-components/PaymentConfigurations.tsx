/**
 * Payment configurations component handles the currency and  tax settings
 */
import React, { useEffect, useState } from "react";
import { IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./mainProfile.scss";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { setDataById } from "@/Libs/store";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
import PayPalConfiguration from "./PayPalConfigurations";
import EditIcon from '@mui/icons-material/Edit';

export const userType = {
    PARTICIPANT: 'PARTICIPANT',
    ORGANISATION: 'ORGANIZATION'
}
interface SecurityProps {
    passEmail: string;
}

const typeArray: any = [
    { label: 'Tax Inclusive', value: 'true' },
    { label: 'Tax Exclusive', value: 'false' }
]

const PaymentConfigurations: React.FC<SecurityProps> = React.memo(({ }) => {
    const POST = useStore((state: any) => state.POST);
    const PUT = useStore((state: any) => state.PUT);
    const taxData = useStore((state: any) => state?.compData?.["tax-list"]?.['tax/list'] ?? "");
    const [editField,setEditField]=useState(taxData?.data?.length!=0?true:false);
    const methods = useForm<any>()
    const {
        handleSubmit,
        control,
        setValue,
        resetField,
        formState: { },
    } = methods;

    useEffect(() => {
        getTaxList();
    }, [])
    /**
     * get the existing tax details
     */
    const getTaxList = () => {
        const companyId: any = sessionStorage.getItem('adminCompanyId')
        const request = {
            filters: {
                "companyId": companyId?.companyId
            }
        }
        POST({
            id: 'tax-list',
            url: 'tax/list',
            body: request,
            successCB: (_context: any) => {
                setValue('taxName', _context?.data?.[0]?.taxName);
                setValue('taxPercentage', _context?.data?.[0]?.taxPercentage);
            }
        })
    }
    /**
     *  Initiates the password reset process by sending the user's email to the forgotPassword
     * @param email
     */
    const handleFormSubmit = async (data: any) => {
        const body = {
            ...data,
            taxInclusive: data.taxInclusive === 'true'
        };
        const successCB = (_context: any) => {
            resetField('taxName');
            resetField('taxPercentage');
            setDataById("snackBarInfo", {
                open: true,
                autoHideDuration: 2000,
                severity: "success",
                message: "Payment Configurations Updated Successfully",
            });
            getTaxList();
            setEditField(true);
        };
        const errorCB = (error: any) => {
            setDataById("snackBarInfo", {
                open: true,
                autoHideDuration: 2000,
                severity: "error",
                message: error.message,
            })
        }
        if (taxData?.data && taxData?.data?.[0]?.id) {
            PUT({
                id: 'payment-configuration-update',
                url: `tax/${taxData?.data?.[0]?.id}`,
                body: body,
                successCB: successCB,
                errorCB: errorCB

            })
        } else {
            POST({
                url: 'tax', body: body,
                id: 'payment-configuration-create',
                successCB: successCB,
                errorCB: errorCB
            })
        }
    };

    return (
        <Grid container className="payment-configuration-container" size={{ xs: 12, sm: 12 }} spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
                <Typography className="payment-configuration-title">Payment Configurations</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }} className="payment-configuration-sub-title-grid">
                <Typography className="payment-configuration-sub-title">PayPal Settings</Typography>
            </Grid>
            <PayPalConfiguration/>
            <Grid container size={{ xs: 12, sm: 12 }}  flexDirection={"row"}className="payment-configuration-sub-title-grid" alignItems={"center"}>
                <Typography className="payment-configuration-sub-title">Tax Settings</Typography>
                {editField&&<IconButton onClick={()=>setEditField(false)}>
                <EditIcon/>
                </IconButton>}
            </Grid>
            <Grid container size={{ xs: 12, sm: 12 }}>
                <Grid container size={{ xs: 12, sm: 6 }} direction={'column'}>
                    <Grid>
                        <Typography className="payment-configuration-text">Manage tax rates, names and inclusivity with ease.</Typography>
                    </Grid>
                </Grid>
                <Grid container size={{ xs: 12, sm: 6 }} spacing={2}>

                    <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                            label="Tax Name"
                            control={control}
                            name="taxName"
                            type="text"
                            rules={{
                                required: true
                            }}
                            readOnly={editField}
                            shrink
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomTextField
                            label="Tax Percentage (%)"
                            suffix={'%'}
                            control={control}
                            name="taxPercentage"
                            type="number"
                            rules={{
                                required: true
                            }}
                            readOnly={editField}
                            shrink
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <CustomRadio
                            className="payment-configuration-add-tax-type"
                            control={control}
                            name="taxInclusive"
                            label=""
                            options={typeArray}
                            row={true}
                            value={taxData?.data?.[0]?.id ? taxData?.data?.[0]?.taxInclusive:true}
                            readonly={editField}
                        />
                    </Grid>
                </Grid>
                <Grid size={{ xs: 12, sm: 12 }} container justifyContent="right" >
                    <Grid className="mb-5">
                        <CustomButton
                            label="Save"
                            onClick={handleSubmit(handleFormSubmit)}
                            className="payment-configuration-button-save"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});

export default PaymentConfigurations;
