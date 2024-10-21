import apiClient from "@/Libs/Https/API-client";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


const VerifyMailPage = () => {
    const { token, id } = useParams<Record<string, string | undefined>>();
    const { setDataById }: any = useStore();
    const decodedId = id ? atob(id) : '';
    const navigate = useNavigate();
    useEffect(() => {
        verifyEmail();
    }, [])
    /**
     * function used to verify email
     */
    const verifyEmail = async () => {
        try {
            const requestBody = {
                userId: decodedId,
                token: token,
                type: "USER_REGISTRATION",

            }
            const response = await apiClient.post(`token/validatetoken`, requestBody)
            if (response.data.status === 'success') {
                setDataById('userDataRegister', { data:{userId:decodedId,token:token} });
                navigate('/setpassword');
            } else {

            }
        } catch (error) {
          Logger.error(error,'VerifyMailPage.tsx')
        }
    };
    return (
        <Grid container justifyContent="center" alignItems="center" height="100vh" gap={2}>
            <CircularProgress />
            <Typography>Verifying your email Please wait...</Typography>
        </Grid>
    );
};

export default VerifyMailPage;
