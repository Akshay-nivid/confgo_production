import CustomButton from "@/components/CustomButton/CustomButton";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import useStore, { GET, POST,PUT,setDataById } from "@/Libs/store";
import Grid from "@mui/material/Grid2"
import { useEffect } from "react";
import { useForm } from "react-hook-form";

/**
*  Componet to render to payal client id configuration
*/
const PayPalConfiguration = () => {
    useEffect(()=>{
        getPayPalId();
    },
    [])

    const methods = useForm<any>()
    const {
        handleSubmit,
        control,
        setValue,
        resetField,
        formState: { },
    } = methods;
    const payPalData = useStore((state: any) => state?.compData?.["paypal-clientId"]?.['paypalConfig']?.data ?? "");
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

    return <Grid container size={12} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
        <Grid size={{ xs: 11, sm: 11 }}>
            <CustomTextField
                label="PayPal Client Id"
                control={control}
                name="clientId"
                type="text"
                rules={{
                    required: true
                }}
                shrink
            />

        </Grid>
        <Grid>
            <CustomButton onClick={handleSubmit(handleFormSubmit)}   className="payment-configuration-button-save"  label="Save" />
        </Grid>

    </Grid>
}

export default PayPalConfiguration;