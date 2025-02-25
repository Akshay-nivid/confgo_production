import { Box, Typography, } from '@mui/material'
import Grid from '@mui/material/Grid2'
import TEventPriceTiers from '@/pages/events/template/_components/TEventPriceTiers/TEventPriceTiers'
import clsx from 'clsx'
import { IEventPriceTier } from '@/Libs/types/event'
import { convertUTCToUserTimeZone } from '@/Utils/CommonBaseClass'
import TRegisterButton from '@/pages/events/template/_components/TRegisterButton/TRegisterButton'

const T6priceTier = () => {
    return (
        <Box >
            <Box className='main t6-tier-section'>
                <h3 className='template-section-title t6-tier-section-title '>Registration & Ticketing</h3>
                <Grid container justifyContent={'center'} columnSpacing={6} rowSpacing={4} className='tiers-container'>

                    <TEventPriceTiers>
                        {
                            ({ data }) => {
                                return (
                                    <>
                                        {
                                            Object?.entries(data).map(([key, priceTier], index: number) => {
                                                const isEven = (index + 1) % 2 === 0
                                                return (
                                                    <Grid size={{ xs: 10, md: 5 }} key={key} className={clsx('tier-item', isEven ? 'even-item' : 'odd-item')}>
                                                        <h5 className='tier-item-title'>{priceTier[0]?.participantType?.name}</h5>
                                                        <Box className={clsx('divider', isEven ? 'even-divider' : 'odd-divider')}></Box>
                                                        {
                                                            priceTier?.map((item: IEventPriceTier) => (
                                                                <>
                                                                    <Box display={"flex"} justifyContent={"space-between"} className="" key={item?.id}>
                                                                        <Box>
                                                                            <Typography className='tier-name'>{item.name}</Typography>
                                                                            <Typography className={clsx('tier-date', isEven ? 'even-date' : 'odd-date')}>{convertUTCToUserTimeZone(item?.startDate, "MMM DD, YYYY")}-{convertUTCToUserTimeZone(item?.endDate, "MMM DD, YYYY")}</Typography>

                                                                        </Box>
                                                                        <Typography className={clsx('tier-price', isEven ? 'even-price' : 'odd-price')}>{item?.percentage}%</Typography>

                                                                    </Box>
                                                                    <Box className={clsx("divider", isEven && 'even-divider', !isEven && 'odd-divider')}></Box>

                                                                </>

                                                            ))
                                                        }
                                                        <TRegisterButton fullWidth userTypeId={2} className={clsx('tier-register-button', isEven ? 'even-register-button' : 'odd-register-button')} usageType='TIER-CARD' >Register Now</TRegisterButton>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </>
                                )
                            }
                        }
                    </TEventPriceTiers>

                </Grid>
            </Box>
        </Box>
    )
}

export default T6priceTier