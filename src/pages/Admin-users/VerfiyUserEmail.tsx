import useStore from "@/Libs/store";
import routes from "@/router/routes";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
/**
*componet for verify user from email
*/
const VerifyUSerMailPage = () => {
    const { token, id } = useParams<Record<string, string | undefined>>();
    const { setDataById }: any = useStore();
    const decodedId = id ? atob(id) : '';
    const navigate = useNavigate();
    const POST = useStore((state: any) => state.POST);
    /**
    *useEffect getting verify mail
    */
    useEffect(() => {
        verifyEmail();
    }, [])
    /**
     * function used to verify email
     */
    const verifyEmail = async () => {
        await POST({
            url:'token/validatetoken',
            body:{
                userId: decodedId,
                token: token,
                type: "USER_REGISTRATION",
            },
            id:'user-email-verification',
            successCB: (_context: any) => {
                setDataById('userDataRegister', { data:{userId:decodedId,token:token, tokenType: "USER_REGISTRATION"} });
                navigate('/setpassword');
            }, 
            errorCB: (context: any) => {
                setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
                navigate(routes.loginOrg());
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

export default VerifyUSerMailPage;
