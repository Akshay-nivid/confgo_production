/**
 * Payment configurations component handles the currency and  tax settings
 */
import React, { useState } from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import "./mainProfile.scss";
import CustomButton from "@/components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import routes from "@/router/routes";
import useStore, { setDataById } from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { purposeTypes } from "@/Utils/CommonBaseClass";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";

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

const PaymentConfigurations: React.FC<SecurityProps> = React.memo(({ passEmail }) => {
    const POST = useStore((state: any) => state.POST);
    const methods = useForm<any>()
    const {
        handleSubmit,
        control,
        setValue,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = methods;

    const navigate = useNavigate();
    const detail = useStore((state: any) => state?.compData?.["company-user"]);
    const email = detail?.email ? detail.email : passEmail;
    const [isLoading, setIsLoading] = useState(false);
    /**
     *  Initiates the password reset process by sending the user's email to the forgotPassword
     * @param email
     */
    const handleFormSubmit = async (data: any) => {
        console.log('testdata', data)
        //return;
        const body = { 
            ...data, 
            taxInclusive: data.taxInclusive === 'true' 
          };
        const successCB = (_context: any) => {
            setDataById("snackBarInfo", {
                open: true,
                autoHideDuration: 2000,
                severity: "success",
                message: "Payment Configurations Updated Successfully",
              });
        };

        POST({
            url: 'tax', body: body,
            id: 'payment-configuration-update',
            successCB: successCB,
            errorCB: (error: any) => {
            setDataById("snackBarInfo", {
                open: true,
                autoHideDuration: 2000,
                severity: "error",
                message: error.message,
            })
            }
        })
    };

    return (
        <Grid container className="payment-configuration-container" size={{ xs: 12, sm: 12 }} spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
                <Typography className="payment-configuration-title">Payment Configurations</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }} className="payment-configuration-sub-title-grid">
                <Typography className="payment-configuration-sub-title">Tax Settings</Typography>
            </Grid>
            <Grid container size={{ xs: 12, sm: 12 }}>
                <Grid container size={{ xs: 12, sm: 6 }} direction={'column'}>
                    {/* <Grid>
                <Typography className="payment-configuration-sub-title">Tax Settings</Typography>
            </Grid> */}
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
                            value={"true"}
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
