import CustomChart from "@/components/CustomCharts/CustomChart";
import useStore, { POST } from "@/Libs/store";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2"
import { useEffect } from "react";



/**
* EventLineChart Component
* 
* This component displays a line chart showing attendance trends based on event data.
* It fetches data from the store and transforms it before passing it to the `CustomChart` component.
* 
* Features:
* - Fetches event revenue count from API based on `eventId`
* - Uses Zustand store (`useStore`) for state management
* - Transforms the API response into a format suitable for the chart
* - Displays a `LineOrange` chart with a legend title of "Total Registrations"
*/
const EventLineChart = (id:any) => {


    const chartData = useStore(state => state?.compData?.EventDetailsChart?.[`dashboard/revenueCount`]?.data) || null;

 
    useEffect(() => {
        
        if (!id) return;

        (async () => {
            POST({
                url: `dashboard/revenueCount`,

                body: {

                    eventId:id?.id

                },
                id: 'EventDetailsChart',



            })

        })();


    }, []);


    /**
     *   Function to transform chart data into the required format
     */

    const transformData = (data: any) => {

        if (!data) return [];

        return data?.map((item: { registeredUsers: number; date: string }) => ({

            key: item?.date,
            value: item?.registeredUsers,
        }));
    };



    return (

        <Grid container size={12} className="eventLineChart-grid" spacing={1} >

            <Grid container size={12} className="eventLineChart-grid-header">

                <Typography className="title">
                    Attendance Trends
                </Typography>
                
            </Grid>
            {chartData?.loading ? (
                <Grid size={12} display={'flex'} justifyContent={'center'}>

                    <Loader />

                </Grid>

            ) : (
                chartData?.length === 0 ? (

                    <Grid size={12} display={'flex'} alignItems={'center'} flexDirection={"column"} className='total-users-icon'>

                        <p className='total-users-label'>No Data available</p>

                    </Grid> ) : 
                    (
                    <CustomChart chartData={transformData(chartData)} chartType={"LineOrange"} legendTitle={"Total Registrations"} />

                )
            )
            }

        </Grid>
    )
}
export default EventLineChart;


/**
 * @returns Loader
 */
const Loader = () => {
    return (
        <CircularProgress color='success' size={"2rem"} />
    )
}

