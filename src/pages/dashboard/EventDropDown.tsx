import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import MikeIcon from "../../assets/svg/karaoke.svg"
import CustomButton from "@/components/CustomButton/CustomButton";
import { setNonPersistedDataById } from "@/Libs/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


/**
 * EventDropDown Component
 * 
 * Displays a dropdown menu with event options and a "Create Event" button.
 * Allows users to select an event type and triggers the update of custom data in the store.
 * Also shows an icon and label related to events.
 * 
 * @param {Object} data - Contains event data for populating the dropdown options.
 * @returns {JSX.Element} - Renders a dropdown menu and create event button.
 */

const EventDropDown = (data: any) => {


    const navigate = useNavigate();

    /**
     * Mapping event data to options for the dropdown
     */
    const options = data?.data?.data?.map((item: any) => ({
        label: item?.name,
        value: item?.id
    }));

    /**
     * React Hook Form's control and state management
     */
    const {
        watch,
        setValue,
        control,
    } = useForm<any>({
        defaultValues: {
            title: "",
            fieldType: "",
            required: false,
        },
    });

    /**
     * Set default value for fieldType from the provided event data
     */

    useEffect(() => {
        setValue('fieldType', data?.data?.data?.[0].id);
    }, [data]);

    /**
     * Save selected eventId type to the store using the watch hook
     */

    useEffect(()=>{

    setNonPersistedDataById("CustomSelectData", { data: watch('fieldType') });
     
    },[watch('fieldType')]);

    return (
        <Grid container size={12} className="adminDashBoard-EventsMenu">

            <Grid className="adminDashBoard-EventsMenu-content" container size={12} alignItems={"center"} spacing={1}>

                <Grid className="heading" size={3}>

                    <Typography className="heading">Dashboard</Typography>

                </Grid>

                <Grid className="DropDownBox" size={6} display={"flex"} gap={1}>

                    <Grid className="DropDownBox-container" size={12} display={"flex"}>
                        <Grid size={12}>

                            <CustomSelect

                                className="DropDownBox-container-dropDown"
                                size="medium"
                                name="fieldType"
                                control={control}
                                defaultValue={options?.[0]?.value}
                                label="" options={options}

                            />

                        </Grid>
                        <Grid size={5} container justifyContent={"center"} alignItems={"center"}
                            className="DropDownBox-container-mikeIcon"  >



                            <MikeIcon />



                            <Grid size={5}>

                                <Typography className="DropDownBox-container-mikeIcon-title">Events</Typography>

                            </Grid>

                        </Grid>



                    </Grid>


                </Grid>
                <Grid className="DropDownBox-container-createEvent" display={"flex"} size={3} >
                    <CustomButton
                        className="DropDownBox-container-createEvent-btn"
                        fullWidth

                        label="Create Event"
                        onClick={() => navigate('/events/create')}
                    />

                </Grid>


            </Grid>
        </Grid>
    )

}
export default EventDropDown;