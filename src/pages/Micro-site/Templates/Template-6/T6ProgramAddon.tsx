import { Avatar, Box, Typography } from "@mui/material";
import TEventProgramsAddons from "../Template-components/TEventProgramsAddons";
import { IEventResponse } from "@/Libs/types/event";
import moment from "moment";
import Grid from "@mui/material/Grid2";
import config from '../../../../../config.json';
import DescriptionComponent from "@/pages/events/template/DescriptionComponent";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TimeComponent from "@/pages/events/template/TimeComponent";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { RedSeat, YellowSeat } from "@/assets/svg";

/**
 * T6ProgramAddon Component
 * 
 * This component renders a program addon section for Template 7.
 * It displays program information in a tabbed interface organized by days.
 * Each tab shows program items with details like title, time, location and speakers.
 * The component integrates with TEventProgramsAddons for data management.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {IEventResponse} props.eventData - Event data containing program information
 * @returns {JSX.Element} Program addon section with tabs and program items
 */

const T6ProgramAddon = ({ eventData }: { eventData?: IEventResponse }) => {
    const baseUrl = config.api.url;

    return (
        <Box id='programs' className="t6-program-addon main">
            <TEventProgramsAddons eventData={eventData}>
                {
                    (data) => {
                        // Find the selected data based on the selected date
                        const selectedData = data?.data[data.selectedDate];
                        return (
                            <>
                                <Box className="tab-container ">
                                    {data?.tabs.map((item: any, index: number) => (
                                        <Box onClick={() => data.handleTabChange(item)} className={data.selectedDate != item ? "tab-container-item" : "tab-container-selected"} key={item + index}>
                                            <Box>
                                                <Typography className="date z-10" textAlign={'center'}>
                                                    {moment(item).format('MMMM D')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Grid className="mt-10" container spacing={2}>
                                    {selectedData?.map((item: any, index: number) => {
                                        return (
                                            <Grid container className="prm-add-container" key={"main" + index} size={12} >
                                                <Grid container size={12} >
                                                    {item.items.map((prg: any, prgIndex: number) => {
                                                        return <Grid container className={prg?.addonId ? "addonbox" : `${item.items.length > 1 && item.items.length - 1 != prgIndex ? 'border-b-2 mx-4 my-1' : 'mx-4 my-1'}`} display={"flex"} size={12} key={prgIndex} justifyContent={"space-between"}   >
                                                            <Grid container flexDirection={'column'} alignContent={"flex-end"} size={12}>
                                                                <Grid container display={'flex'} justifyContent={'space-between'} size={12}>
                                                                    <Grid display={'flex'} columnGap={2} alignItems={'center'}>
                                                                        <Box display={'block'}>
                                                                            {prg.eventSponsors.length > 0 &&
                                                                                <Typography>Sponsored by</Typography>}
                                                                            {prg?.eventSponsors?.map((sponsor: any) => {
                                                                                return (
                                                                                    <Box key={sponsor?.sponsor?.id} className="inline-flex">
                                                                                        {sponsor?.sponsor?.logoAssetId ? (
                                                                                            <Grid className="sponosr-img-container">
                                                                                                <img
                                                                                                    alt={sponsor?.sponsor?.name}
                                                                                                    src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                                                                                />
                                                                                            </Grid>
                                                                                        ) : (
                                                                                            <Box className='flex-col gap-4' >
                                                                                                <Avatar className="sponosr-img-container" alt={sponsor?.sponsor?.name} src="" />
                                                                                            </Box>
                                                                                        )}
                                                                                    </Box>
                                                                                );
                                                                            })}
                                                                        </Box>
                                                                        <Grid>
                                                                            {prg.eventSpeakers?.length > 0 &&
                                                                                <Typography>Speakers</Typography>}
                                                                            {prg?.eventSpeakers?.map((speaker: any) => {
                                                                                return (
                                                                                    <Box key={speaker?.user?.id} className="inline-flex">
                                                                                        {speaker?.user?.assetId ? (
                                                                                            <Grid>
                                                                                                <Avatar
                                                                                                    alt={speaker?.user?.firstName}
                                                                                                    src={`${baseUrl}asset/${speaker?.user?.assetId}`}
                                                                                                    sx={{ width: 30, height: 30, objectFit: 'cover' }}
                                                                                                />
                                                                                            </Grid>
                                                                                        ) : (
                                                                                            <Box>
                                                                                                <Avatar sx={{ width: 30, height: 30 }} alt={speaker?.user?.firstName} src="" />
                                                                                            </Box>
                                                                                        )}
                                                                                    </Box>
                                                                                );
                                                                            })}
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid>
                                                                        {item.items.length > 1 && prgIndex == 0 ? (
                                                                            <Avatar onClick={() => data?.handleModalOpen(item?.items)} className="view-detail-btn">
                                                                                <ArrowOutwardRoundedIcon />
                                                                            </Avatar>
                                                                        ) : item.items.length === 1 ? (
                                                                            <Avatar onClick={() => data?.handleModalOpen(item?.items)} className="view-detail-btn">
                                                                                <ArrowOutwardRoundedIcon />
                                                                            </Avatar>
                                                                        ) : null}
                                                                    </Grid>
                                                                </Grid>
                                                                <Box className="prg-title">
                                                                    <Typography>{prg?.addonId ? prg?.addon?.name : prg?.name}</Typography>
                                                                </Box>
                                                                <Box>
                                                                    <DescriptionComponent
                                                                        temp={"temp4"}
                                                                        description={prg?.description}
                                                                        classPrefix={`prg-description`}
                                                                    />
                                                                </Box>
                                                                {prg?.hall && <Box className="inline-flex">
                                                                    <LocationOnIcon />
                                                                    <Typography>{prg?.hall}</Typography>
                                                                </Box>}
                                                                <Box className="prg-time-container" justifyContent={'center'} alignItems={'center'} style={{ display: 'flex', justifyContent: 'start' }}>
                                                                    <Box display={"flex"}>
                                                                        <AccessTimeFilledIcon />
                                                                        <TimeComponent
                                                                            month={false}
                                                                            startTime={prg?.startTime}
                                                                            endTime={prg?.endTime}
                                                                            classPrefix={`text`}
                                                                        />
                                                                    </Box>
                                                                    <Box display={"flex"}>< LocalOfferIcon />
                                                                        <p className="text">${prg?.amount}</p>
                                                                    </Box>
                                                                    <Box display={'flex'}>
                                                                                        {(prg?.eventParticipantEntries || []).map((entry: any, index: any) => {
                                                                                            const { seatAllocated = 0, totalSeat = 1 } = entry;
                                                                                            const remainingSeat = totalSeat - seatAllocated;
                                                                                            const bookedPercentage = (seatAllocated / totalSeat) * 100;
                                                                                            const isOverbookedRed = bookedPercentage > 85;
                                                                                            const isOverbookedYellow = bookedPercentage > 70;

                                                                                            if (!isOverbookedYellow) return null;
                                                                                            return (
                                                                                                <Grid container key={index} spacing={2} alignItems="center" >
                                                                                                    {/* Seat Information */}
                                                                                                    <Grid container alignItems="center" spacing={.5}>
                                                                                                        <Grid paddingBottom={.5}>
                                                                                                            {isOverbookedRed ? <RedSeat fontSize={18} /> : <YellowSeat fontSize={18} />}
                                                                                                        </Grid>
                                                                                                        <Grid>
                                                                                                            {remainingSeat === 0 ? (
                                                                                                                <Typography variant="body1" className="program-seat-alert-red">
                                                                                                                    {seatAllocated} / {totalSeat} Unfortunately, all seats have been booked.
                                                                                                                </Typography>
                                                                                                            ) : (
                                                                                                                <Typography variant="body1" className={isOverbookedRed ? "program-seat-alert-red" : "program-seat-alert-yellow"}>
                                                                                                                    {seatAllocated} / {totalSeat} Hurry up! Only {remainingSeat} left! Secure your spot now!
                                                                                                                </Typography>
                                                                                                            )}
                                                                                                        </Grid>
                                                                                                    </Grid>
                                                                                                </Grid>
                                                                                            );
                                                                                        })}
                                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>

                                                    })}
                                                </Grid>

                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </>
                        )
                    }
                }

            </TEventProgramsAddons>
        </Box>
    )
}

export default T6ProgramAddon;