// import CustomBarChart from "@/components/CustomCharts/CustomBarChart";
import CustomChart from "@/components/CustomCharts/CustomChart";
import useStore, { POST } from "@/Libs/store";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2"
import moment from "moment";
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
const EventLineChart = ({id}:{id?:string}) => {


    const chartData = useStore(state => state?.compData?.EventDetailsChart?.[`dashboard/revenueCount`]?.data) || null;

 
    useEffect(() => {
        
        if (!id) return;

        (async () => {
            POST({
                url: `dashboard/revenueCount`,

                body: {

                    eventId:id

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


    /**
    * If no data is available in `chartData`, this function generates default data 
    * for the last 5 days with `registeredUsers` set to 0.
    * 
    * - Uses `moment` to get past 5 days.
    * - Adds 2 days to ensure alignment with expected date format.
    * - Returns an array of objects with `key` (date) and `value` (0).
    * - Reverses the array to maintain chronological order.
    */

    const generateBarChartData = () => {
        return Array.from({ length: 5 }, (_, index) => {
          const date = moment().subtract(index, 'days').add(2, 'days').format('MMM-D');
          return {
            key: date,
            value: 0
          };
        }).reverse();
      };

      const barChartDataArray = generateBarChartData();




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

                        
                        <CustomChart chartData={barChartDataArray} chartType={"LineOrange"} legendTitle={"Total Registrations"}  />

                    </Grid> 
                    ) : 
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

