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
import { RedSeat, YellowSeat } from "@/assets/svg";

/**
 * T7ProgramAddon Component
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

const T7ProgramAddon = ({ eventData }: { eventData?: IEventResponse }) => {
    const baseUrl = config.api.url;

    return (
        <Box id='programs' className="t7-program-addon main">
            <TEventProgramsAddons eventData={eventData}>
                {
                    (data) => {
                        // Find the selected data based on the selected date
                        const selectedData = data?.data[data.selectedDate];
                        return (
                            <>
                                <Box className="tab-container ">
                                    {data?.tabs?.map((item: any, index: number) => (
                                        <Box onClick={() => data.handleTabChange(item)} className={data.selectedDate != item ? "tab-container-item" : "tab-container-selected overflow-visible z-10 before:-z-10 relative before:content-[' '] before:absolute before:h-8 before:w-8  before:bg-[#336AEA] before:-bottom-2 before:overflow-visible  before:transform before:rotate-45 before:left-1/2 before:-translate-x-1/2"} key={item + index}>
                                            <Box className={'gap-2 '}>
                                                <Typography className="title z-10" textAlign={'center'}>Day {index + 1}</Typography>
                                                <Typography className="date z-10" textAlign={'center'}>
                                                    {moment(item).format('MMMM D')}
                                                </Typography>

                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                                <Grid className="mt-10" container spacing={2}>
                                    {selectedData?.map((item: any, index: number) => {
                                        // const isFullWidth = item.items.length === 3;
                                        let itemSize: any = { xs: 12, sm: 4 };
                                        if (item?.items?.length === 3) {
                                            itemSize = { xs: 12, sm: 12 };
                                        } else if (item?.items?.length === 2) {
                                            itemSize = { xs: 12, sm: 'auto' };
                                        }

                                        let childItemSize: any = { xs: 12, sm: 12 };
                                        if (item?.items?.length === 3) {
                                            childItemSize = { xs: 12, sm: 4 };
                                        } else if (item?.items?.length === 2) {
                                            childItemSize = { xs: 12, sm: 'auto' }
                                        }

                                        return (
                                            <Grid container className="prm-add-container" key={"main" + index} size={itemSize} onClick={() => data?.handleModalOpen(item?.items)}>
                                                <Grid container size={12}>
                                                    {item?.items?.map((prg: any, prgIndex: number) => {
                                                        return <Grid container className={prg?.addonId ? "addonbox p-2" : "p-2"} display={"flex"} size={childItemSize} key={prgIndex} justifyContent={"space-between"}   >
                                                            <Grid size={12} display={'block'}>
                                                                <Grid  container justifyContent={"space-between"}>
                                                                    <Box display={'block'}>
                                                                        {prg?.eventSponsors?.length > 0?
                                                                            <Typography variant="h6">Sponsored by</Typography>:<Box className="mt-24"></Box>}
                                                                        {prg?.eventSponsors?.map((sponsor: any) => {
                                                                            return (
                                                                                <Box key={sponsor?.sponsor?.id} className="inline-flex">
                                                                                    {sponsor?.sponsor?.logoAssetId ? (
                                                                                        <Grid className="sponosr-img-container">
                                                                                            <img
                                                                                                alt={sponsor?.sponsor?.name}
                                                                                                src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                                                                                width={35}
                                                                                                height={35}
                                                                                            
                                                                                            />
                                                                                        </Grid>
                                                                                    ) : (
                                                                                        <Box className='flex-col gap-4' >
                                                                                            <Avatar className="sponosr-img-container" alt={sponsor?.sponsor?.name}  sx={{ width: 35, height: 35, objectFit: 'cover' }} src="" />
                                                                                        </Box>
                                                                                    )}
                                                                                </Box>
                                                                            );
                                                                        })}
                                                                    </Box>
                                                                    <Grid>
                                                                        {prg.eventSpeakers?.length > 0 ?
                                                                            <Typography variant="h6">Speakers</Typography>:<Box className="mt-24"></Box>}
                                                                        {prg?.eventSpeakers?.map((speaker: any) => {
                                                                            return (
                                                                                <Box key={speaker?.user?.id} className="inline-flex">
                                                                                    {speaker?.user?.assetId ? (
                                                                                        <Grid>
                                                                                            <Avatar
                                                                                                alt={speaker?.user?.firstName}
                                                                                                src={`${baseUrl}asset/${speaker?.user?.assetId}`}
                                                                                                sx={{ width: 35, height: 35, objectFit: 'cover' }}
                                                                                            />
                                                                                        </Grid>
                                                                                    ) : (
                                                                                        <Box>
                                                                                            <Avatar  sx={{ width: 35, height: 35, objectFit: 'cover' }} alt={speaker?.user?.firstName} src="" />
                                                                                        </Box>
                                                                                    )}
                                                                                </Box>
                                                                            );
                                                                        })}
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
                                                                {prg?.hall && <Box className="inline-flex col-span-1 prg-location-container" alignItems={'center'} justifyContent={'center'}>
                                                                    <LocationOnIcon />
                                                                    <Typography>{prg?.hall}</Typography>
                                                                </Box>}
                                                                <Grid display={'flex'}>
                                                                <Box className="prg-time-container">
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
                                                                </Box>
                                                                </Grid>
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

export default T7ProgramAddon;