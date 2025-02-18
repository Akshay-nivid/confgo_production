import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import useStore, { GET, POST,PUT,setDataById } from "@/Libs/store";
import Grid from "@mui/material/Grid2"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EditIcon from '@mui/icons-material/Edit';
/**
*  Componet to render to payal client id configuration
*/
const PayPalConfiguration = () => {
    useEffect(()=>{
        getPayPalId();
    },
    [])
    const payPalData = useStore((state: any) => state?.compData?.["paypal-clientId"]?.['paypalConfig']?.data ?? "");
    const [editField,setEditField]=useState(payPalData?true:false);
    const methods = useForm<any>()
    const {
        handleSubmit,
        control,
        setValue,
        resetField,
        formState: { },
    } = methods;

    /**
    *  get paypal client info
    */
    const getPayPalId = () => {
        GET({
            id: 'paypal-clientId',
            url: 'paypalConfig',
            successCB: (context: any) => {
                setValue('clientId', context?.data?.clientId);
            }
        })
    }
    /**
    *  handles form submit client id 
    * @param data 
    */
    const handleFormSubmit = async (data: any) => {
        const companyId: any = sessionStorage.getItem('companyId');
        const body = {
            ...data,
            companyId: companyId,
            currency: "USD"
        };
        const successCB = (_context: any) => {
            resetField('clientId');
            setDataById("snackBarInfo", {
                open: true,
                autoHideDuration: 2000,
                severity: "success",
                message: "PayPal Configurations Updated Successfully",
            });
            setEditField(true); 
            getPayPalId();
        };
        const errorCB = (error: any) => {
            setDataById("snackBarInfo", {
                open: true,
                autoHideDuration: 2000,
                severity: "error",
                message: error.message,
            })
        }

        if (payPalData && payPalData?.id) {
            PUT({
                url: `paypalConfig/${payPalData?.id}`,
                body: body,
                id: 'payment-configuration-create',
                successCB: successCB,
                errorCB: errorCB
            })
        } else {
            POST({
                url: 'paypalConfig', body: body,
                id: 'payment-configuration-create',
                successCB: successCB,
                errorCB: errorCB
            })
        }
    };

    return <Grid container size={12} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={2}>
        <Grid size={{ xs: 10, sm: 11 }}>
            <CustomTextField
                label="PayPal Client Id"
                control={control}
                name="clientId"
                type="text"
                rules={{
                    required: true
                }}
                readOnly={editField}
                suffixIconButton={editField&&<EditIcon />} 
                handleToggleSuffixIcon={() => {setEditField(false) }}
                shrink
            />
        </Grid>
        <Grid size={{xs:2,sm:1}}>
            <CustomButton onClick={handleSubmit(handleFormSubmit)}   className="payment-configuration-button-save"  label={payPalData?"Update":"Add" }/>
        </Grid>

    </Grid>
}

export default PayPalConfiguration;