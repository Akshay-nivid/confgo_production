import { BasicPlainIcon, EnterPriseFeeIcon, ProPlanIcon, StandardPlanIcon } from "@/assets/svg";
import CustomButton from "@/components/CustomButton/CustomButton";
import useStore, { POST, setNonPersistedDataById } from "@/Libs/store";
import routes from "@/router/routes";
import { toCamelCase } from "@/Utils/CommonBaseClass";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
* componet renders different plans
*/
const PlanBilling: React.FC<any> = () => {
    const setDataById = useStore((state: any) => state.setDataById)
    const navigate = useNavigate();
    const planLoaded = useStore((state: any) => state?.nonPersistedData?.['plan-data']?.value) ?? false;
    const planData = useStore((state: any) => state?.compData?.['plan-list-data']?.['plan/list']?.data) ?? [];
    /*
    * get state data if selected plan data is there
    */
    useEffect(() => {
        if (!planLoaded || planData?.length == 0) {
            getPlanData();
        }
        currentPlan();
    }, []);
    const currentPlan = () => {
        POST({
            id: "admin-current-plan",
            url: 'payment/subscription/list',
            body: {}
        })

    }
    /*
    * get the plan data here
    */
    const getPlanData = () => {
        POST({
            id: 'plan-list-data',
            url: 'plan/list',
            body: {},
            successCB: (_context: any) => {
                setNonPersistedDataById('plan-data', { value: true });
            }
        })
    }

    /*
     * function to change the state and store selected plan
     */
    const handleClick = (plan?: any) => {
        setDataById('planDetails', { field_values: { ...plan } });
        navigate(routes.upgradePlanPayment());
    }

    const planMapper: Record<string, React.ReactNode> = {
        "BASIC_PLAN": <BasicPlainIcon />,
        "STANDARD_PLAN": <StandardPlanIcon />,
        "PRO_PLAN": <ProPlanIcon />,
        "ENTERPRISE_PLAN": <EnterPriseFeeIcon />
    }
    /**
     * It updates the global state based on the mode and navigates to the appropriate route.
     */
    const handleContactUs = () => {
        navigate(routes.contact());
    }

    return <Grid container size={{ xs: 12, sm: 12 }} spacing={1}>
        <Grid container size={{ xs: 12, sm: 12 }}>
            <Typography textAlign={'left'} className="title">Choose Plan</Typography>
            <Grid container size={12} spacing={2}>
                {planData.map((plan: any) => {
                    return <Grid className={plan?.name == "ENTERPRISE_PLAN" ? "c-plan-card-2" : "c-plan-card"} size={12} >
                        <Grid
                            container
                            flexDirection={{ xs: "column", md: "row" }}
                            alignItems={"center"}
                            gap={2}
                            justifyContent={"space-between"}
                        >
                            <Grid
                                justifyContent={{ xs: "center", md: "start" }}
                                width={{ xs: "100%", md: "26%" }}
                                container
                                flexDirection={"row"}
                                alignItems={"center"}
                                gap={1}
                            >
                                <Grid className="svg-img"> {planMapper[plan?.name]}</Grid>
                                <Grid>
                                    <Typography className="plan-name">{toCamelCase(plan?.name)}</Typography>
                                    <Typography className="plan-type">{plan?.organizationType}</Typography>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent={"center"} size={{ xs: 12, md: "auto" }} >
                                {plan?.name != "ENTERPRISE_PLAN"
                                    ? <Typography textAlign={{ xs: "center", md: "center" }} className="plan-amount">
                                        ${parseInt(plan?.amount).toLocaleString()}
                                    </Typography>
                                    : <Typography textAlign={{ xs: "center", md: "center" }} className="plan-amount">
                                        For those who need a scalable custom solution.
                                    </Typography>
                                }
                            </Grid>

                            <Grid container justifyContent={"center"} size={{ xs: 12, md: 'auto' }}>
                                <CustomButton
                                    className="plan-btn"
                                    variant="outlined"
                                    label={plan?.name == "ENTERPRISE_PLAN" ? "Contact Us" : "Choose this plan"}
                                    onClick={plan?.name != "ENTERPRISE_PLAN" ? () => handleClick(plan) : () => handleContactUs()}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                })}
            </Grid>
        </Grid>



    </Grid>
}

export default PlanBilling;