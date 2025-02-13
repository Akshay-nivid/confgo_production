import CustomChart from '@/components/CustomCharts/CustomChart'
import apiClient from '@/Libs/Https/API-client'
import useStore, { setDataById, setNonPersistedDataById, snackBar } from '@/Libs/store'
import { processAPIResponse } from '@/Utils/CommonBaseClass'
import { CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect } from 'react'
import CustomBarChart from '@/components/CustomCharts/CustomBarChart'
import { PichartIcon } from '@/assets/svg'


/**
 * This component renders a chart displaying revenue breakdown and total users registered
 * @function
 * @returns {JSX.Element} Chart component
 */
const RevenueAndUserChart = () => {

    const chartData: acc = useStore((state) => state.compData?.['revenueChartData']?.data) || {};
    // const filterDates = useStore(state => state.nonPersistedData?.chartFilterDate?.value) || null;
    const isLoading = useStore(state => state.nonPersistedData?.chartDataLoading?.value)
    const eventId = useStore(state => state.nonPersistedData?.CustomSelectData?.data) || null

    /**
     * function to fetch data for drawing the chart
     */
    useEffect(() => {


        if (!eventId) return
        
        (async () => {
            try {
                setNonPersistedDataById('chartDataLoading', { value: true })
                const response = await apiClient.post("dashboard/revenueCount", {
                    eventId: eventId
                });

                const { data, status, message } = processAPIResponse(response, "revenueCount");


                if (status) {
                    setNonPersistedDataById('chartFilterDate', { value: null })



                    const revenueChartData = transformData(data)


                    setDataById('revenueChartData', { data: { ...revenueChartData } });

                } else {
                    snackBar({ severity: 'error', message });
                    setNonPersistedDataById('chartFilterDate', { value: null })

                    return;
                }
            } catch (e) {
                setNonPersistedDataById('chartFilterDate', { value: null })
                if (e instanceof Error) {
                    snackBar({ severity: 'error', message: e.message })
                } else {
                    snackBar({ severity: 'error', message: 'something went wrong' })

                }
            } finally {
                setNonPersistedDataById('chartDataLoading', { value: false })

            }


        })()



    }, [eventId])



  


    type acc = {
        totalUsers: number,
        barChartData: { name: string, value: number }[]
        pieChartData: { key: string, value: number }[]

    }
    function transformData(data: { amount: number, date: string, registeredUsers: number }[]) {


        return data?.reduce((acc: acc, item: { amount: number; date: string; registeredUsers: number }) => {
            // Initialize totalUsers if it doesn't exist
            if (!acc?.totalUsers) {
                acc.totalUsers = 0;
            }
            acc.totalUsers += item?.registeredUsers; // Accumulate total users

            // Push the transformed data into the data array
            acc.barChartData?.push({
                name: item?.date,
                value: item?.amount,

            });
            acc.pieChartData?.push({
                key: item?.date,
                value: item?.registeredUsers,

            });

            return acc;
        }, { totalUsers: 0, barChartData: [], pieChartData: [] })

    }


    


    return (


        <Grid  size={{ xs: 12, sm: 12 }}  container minHeight={'24.5rem'} columnSpacing={2} rowSpacing={2} className="revenue-and-user-chart">
            <Grid size={{xs:12,md:8}} height={{xs:'24.5rem'}} container flexDirection={"column"} borderRadius={".83rem"}  boxShadow={"rgba(0, 0, 0, 0.12) 0rem 0rem 0.3125rem 0rem,  rgba(0, 0, 0, 0.12) 0rem 0rem 0.0625rem 0rem"}  bgcolor={"white"} paddingBlock={1} paddingRight={2.2} >
                <>

                    <Grid size={12} display={'flex'} columnGap={8} className="header-container" paddingInline={2.2}>
                        <p className="revenue-breakdown-label "> REVENUE BREAKDOWN</p>
                    </Grid>


                    <Grid justifyContent={"center"} flex={1} display={"flex"} alignItems={"center"} size={12} minWidth={'100%'} >
                        {isLoading ? <Loader /> : (!chartData || chartData?.barChartData?.length === 0) ? <p className='total-users-label'>No Data available</p> : <CustomBarChart barProps={{ dataKey: 'value' }} chartData={chartData?.barChartData} />}
                    </Grid>

                </>


            </Grid>

            <Grid size={{xs:12,md:4}}  container borderRadius={".83rem"} boxShadow={"rgba(0, 0, 0, 0.12) 0rem 0rem 0.3125rem 0rem,  rgba(0, 0, 0, 0.12) 0rem 0rem 0.0625rem 0rem"} bgcolor={'white'} padding={'1rem'}>

                        <Grid size={12}>
                            <p className='total-users-label'>Total Users Registered</p>
                            <p className='total-users-value'>{chartData?.totalUsers || ''}</p>
                        </Grid>

                        <Grid size={12} minWidth={'100%'} maxHeight={"20rem"} className="pie-chart-grid">
                            {isLoading ?
                                <Grid size={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Loader />
                                </Grid> :

                                chartData?.pieChartData?.length === 0 ?

                                    <Grid size={12} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={"column"} className='total-users-icon'>
                                        
                                        <PichartIcon/>
                                       
                                        <p className='total-users-label'>No Data available</p>
                                    </Grid>
                                    :
                                    <CustomChart chartType="Pie" chartData={chartData?.pieChartData} />}
                        </Grid>
                  

            </Grid>



        </Grid>
    )
}

export default RevenueAndUserChart


// const DatePicker = () => {
//     const form = useForm({
//         defaultValues: {
//             startDate: '',
//             endDate: '',
//         }
//     })


//     const startDate = form.watch('startDate');
//     const endDate = form.watch('endDate');

//     const date = useStore(state => state.nonPersistedData?.datePickerchartFilterDate?.value)

//     useEffect(() => {

//         if (startDate && endDate) {

//             setNonPersistedDataById('chartFilterDate', { value: { startDate, endDate } })
//             setNonPersistedDataById('datePickerchartFilterDate', { value: { startDate, endDate } })

//         }

//     }, [startDate, endDate])


//     return (
//         <>
//             <Grid size={6}>
//                 <CustomDatePicker defaultValue={date?.startDate || ''} label='start date' placeholder='start date' className='chart-date-picker' control={form.control} name='startDate' />

//             </Grid>
//             <Grid size={6}>
//                 <CustomDatePicker defaultValue={date?.endDate || ''} label='end date' className='chart-date-picker' control={form.control} name='endDate' />

//             </Grid>
//         </>
//     )
// }


const Loader = () => {
    return (
        <CircularProgress color='success' size={"2rem"} />
    )
}