import CustomDatePicker from '@/components/CustomDatePicker/CustomDatePicker'
import CustomChart from '@/components/CustomLineChart/CustomChart'
import apiClient from '@/Libs/Https/API-client'
import useStore, { setDataById, setNonPersistedDataById, snackBar } from '@/Libs/store'
import { processAPIResponse } from '@/Utils/CommonBaseClass'
import { CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect } from 'react'
import {  useForm } from 'react-hook-form'

/**
 * This component renders a chart displaying revenue breakdown and total users registered
 * @function
 * @returns {JSX.Element} Chart component
 */
const RevenueAndUserChart = () => {

    const chartData = useStore((state) => state.compData?.['revenueChartData']?.data) || [];
    const filterDates = useStore(state => state.nonPersistedData?.chartFilterDate?.value) || null;
    const isLoading = useStore(state => state.nonPersistedData?.chartDataLoading?.value)



    /**
     * function to fetch data for drawing the chart
     */
    useEffect(() => {

        if (!filterDates?.startDate || !filterDates?.endDate) return

        (async () => {
            try {
                setNonPersistedDataById('chartDataLoading', { value: true })
                const response = await apiClient.post("dashboard/revenueCount", {
                    "startDate": filterDates?.startDate,
                    "endDate": filterDates?.endDate
                });

                const { data, status, message } = processAPIResponse(response, "revenueCount");


                if (status) {
                    setNonPersistedDataById('chartFilterDate', { value: null })

                    const revenueChartData = transformData(data)

                    console.log(revenueChartData, 'ress')

                    setDataById('revenueChartData', { data: revenueChartData });

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



    }, [filterDates?.startDate, filterDates?.endDate])



    type acc = {
        totalUsers: number,
        lineChartData: { key: string, value: number }[]
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
            acc.lineChartData?.push({
                key: item?.date,
                value: item?.amount,

            });
            acc.pieChartData?.push({
                key: item?.date,
                value: item?.registeredUsers,

            });

            return acc;
        }, { totalUsers: 0, lineChartData: [], pieChartData: [] })

    }




    return (
        <Grid size={{ xs: 12, sm: 12 }} container minHeight={'24rem'} columnSpacing={2} className="revenue-and-user-chart">
            <Grid size={8} container flexDirection={"column"} borderRadius={".83rem"} border={"0.083rem solid #E9E9E9"} bgcolor={"white"} padding={2.2}>

                {isLoading ?
                    <Loader />
                    :
                    <>
                        <Grid size={12} display={'flex'} columnGap={8} className="header-container">
                            <p className="revenue-breakdown-label "> REVENUE BREAKDOWN</p>
                            <Grid  flex={1} display={'flex'}   rowGap={1.5} alignItems={'center'} columnGap={1}>

                                <DatePicker  />
                               
                            </Grid>
                        </Grid>

                        <Grid justifyContent={"center"} flex={1}  display={"flex"}  alignItems={"center"} size={12} >
                            { chartData.lineChartData?.length === 0 ? <p className='total-users-label'>No Data available</p> : <CustomChart chartType="LineGreen" chartData={chartData?.lineChartData} />}
                        </Grid>
                    </>
                }

            </Grid>

            <Grid size={4} container borderRadius={".83rem"} border={"0.083rem solid #E9E9E9"} bgcolor={'white'} padding={'1rem'}>
                {isLoading ? <Loader /> :
                    <>
                        {chartData.totalUsers === 0 ?
                            <Grid size={12} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <p className='total-users-label'>No Data available</p>
                            </Grid>
                            :
                            <>
                                <Grid size={12}>
                                    <p className='total-users-label'>Total Users Registered</p>
                                    <p className='total-users-value'>{chartData?.totalUsers}</p>
                                </Grid>

                                <Grid size={12} width={'100%'} maxHeight={"24rem"} className="pie-chart-grid">
                                    <CustomChart chartType="Pie" chartData={chartData?.pieChartData} />

                                </Grid>
                            </>
                        }
                    </>
                }

            </Grid>

           

        </Grid>
    )
}

export default RevenueAndUserChart


const DatePicker = () => {
    const form = useForm({
        defaultValues: {
            startDate: '',
            endDate: '',
        }
    })

    console.log(typeof form.watch('startDate'), form.watch('endDate'))

    const startDate = form.watch('startDate');
    const endDate = form.watch('endDate');

    useEffect(() => {

        if (startDate && endDate) {

            setNonPersistedDataById('chartFilterDate', { value: { startDate, endDate } })
        }

    }, [startDate, endDate])


    return (
        <>
            <Grid size={6}>
            <CustomDatePicker  label='start date' placeholder='start date' className='chart-date-picker' control={form.control} name='startDate' />
                
            </Grid>
            <Grid size={6}>
            <CustomDatePicker label='end date' className='chart-date-picker' control={form.control} name='endDate' />
                
            </Grid>
        </>
    )
}


const Loader = () => {
    return (
        <Grid size={12} height={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            <CircularProgress color='success' size={"2rem"} />
        </Grid>
    )
}