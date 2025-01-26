import useStore from "@/Libs/store/store";
import routes from "@/router/routes";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ResponseData {
    data: boolean;
    loading: boolean;
    success: boolean;
}
/**
* functional compoent for verification of email for password reset
*/
const ChangeVerification = () => {
    const { token, id } = useParams<Record<string, string | undefined>>();
    const { setDataById }: any = useStore();
    const decodedId = id ? atob(id) : '';
    const navigate = useNavigate();
    const POST = useStore((state: any) => state.POST);
    useEffect(() => {
        verifyEmail();
    }, [])
    /**
     * function used to verify email
     */
    const verifyEmail = async () => {
        const body = {
            userId: decodedId,
            token: token,
            type: "FORGOT_PASSWORD_OTP",
        };
        await POST({
            url: `token/validatetoken`,
            body: body,
            id:'passwordVerifyEmail',
            successCB: (_success: ResponseData) => {
                setDataById('userDataRegister', { data: { userId: decodedId, token: token, tokenType: "FORGOT_PASSWORD_OTP" } });
                navigate('/setpassword');
            },
            errorCB: (error: any) => {
                navigate(routes.loginOrg())
                setDataById("snackBarInfo", {
                    open: true,
                    autoHideDuration: 2000,
                    severity: "error",
                    message: error.message,
                })
            }
        });


    };
    return (
        <Grid container justifyContent="center" alignItems="center" height="100vh" gap={2}>
            <CircularProgress />
            <Typography>Verifying your email Please wait...</Typography>
        </Grid>
    );
};


export default ChangeVerification;