import CustomButton from "@/components/CustomButton/CustomButton";
import CustomCheckbox from "@/components/CustomCheckbox/CustomCheckbox";
import useStore from "@/Libs/store";
import { Logger } from "@/Utils/Logger";
import { Dialog, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";

interface TermsAndConditionProps {
    open: boolean;  
    onClose: () => void; 
}

interface FormData {
    terms: string[],
}

const TermsAndCondition = ({ open, onClose }: TermsAndConditionProps) => {
    const { handleSubmit, control } = useForm<FormData>();
    const PUT = useStore((state: any) => state.PUT);
    const setDataById = useStore((state: any) => state.setDataById);

    const termsArray: string[] = [
        "All events hosted on our platform must adhere to local laws and regulations. The organizer is solely responsible for ensuring compliance and safety during the event. Payments made through the platform are governed by our payment terms, and any refund requests will follow the cancellation policy outlined during event creation.",
        "We are committed to protecting user data as per our privacy policy. Sensitive attendee information will remain confidential and will not be shared without explicit consent. Misuse of the platform, including violation of policies or improper content, may result in account suspension.",
        "Templates and features provided for event customization are subject to availability. Modifications made to event templates after publishing may involve additional charges or limitations."
    ];

    const onSubmit = (data: any) => {
        if (data?.terms!=undefined&&data?.terms[0] === "YES") {
            handleAcceptTerms();
        } else if (data.terms.length === 0 || data?.terms ==undefined) {
            setDataById("snackBarInfo", {
                open: true,
                autoHideDuration: 2000,
                severity: "error",
                message: "Please Confirm Terms and Conditions",
            });
        }
    };

    const handleAcceptTerms = async () => {
        onClose();  // Close the dialog after accepting terms
        try {
            const id = sessionStorage.getItem('userId');
            const requesBody = {
                acceptedTerms: 1
            };
            PUT({
                url: `/user/${id}`,
                body: requesBody,
                successCB: () => {
                    sessionStorage.setItem('acceptedTerms','1');
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "success",
                        message: "Terms Accepted",
                    });
                },
                errorCB: () => {
                    setDataById("snackBarInfo", {
                        open: true,
                        autoHideDuration: 2000,
                        severity: "error",
                        message: "Something went wrong",
                    });
                },
            });
        } catch (e) {
            Logger.error('TermsAndCondition.tsx', e);
        }
    };

    return (
        <Dialog open={open} className="terms-modal"  onClose={(reason) => {
            if (reason === 'backdropClick') {
                return; 
            }
        }}
        disableEscapeKeyDown
        keepMounted={true} >
            <Grid container spacing={2} justifyContent={"center"} alignContent={"center"}>
                <Typography className="terms-modal-header">Terms and Conditions</Typography>
                <Grid container spacing={2} size={12}>
                    <Grid container>
                        <Typography className="terms-modal-subHeader" >Please Review and Accept Our Terms</Typography>
                    </Grid>
                    {termsArray.map((item: string, index: number) => (
                        <Grid container key={index}>
                            <Typography textAlign={"start"} className="terms-modal-param">
                                ◆ {item}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                <Grid container size={12}>
                    <form className="terms-modal-form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid>
                            <CustomCheckbox
                                className="terms-modal-checkBox"
                                control={control}
                                name="terms"
                                options={[{ label: "I confirm that I have read and agree to the Terms and Conditions.", value: "YES" }]} />
                        </Grid>
                        <Grid size={12} container justifyContent={"flex-end"}>
                            <CustomButton
                                className="terms-modal-accept-btn"
                                type="submit"
                                label="Accept"
                                variant="contained"
                            />
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default TermsAndCondition;
