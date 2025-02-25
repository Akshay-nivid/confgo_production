import { Dollar } from '@/assets/svg'
import { Typography, Box, Tooltip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import moment from 'moment'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox'
import { formatDate } from '../Program-Selection/programsHandlers'
import clsx from 'clsx'
import { truncateString } from '@/Utils/CommonBaseClass';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalTimeDate from '@/components/LocalTimeDate/LocalTimeDate';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useFormContext } from 'react-hook-form';
import useStore, { setNonPersistedDataById } from '@/Libs/store';
import HTMLReactParser from 'html-react-parser/lib/index';

import { YellowSeat, RedSeat } from '@/assets/svg/index';
import { IProgram } from '@/Libs/types/event';
import CustomButton from '@/components/CustomButton/CustomButton';
import { Check } from '@mui/icons-material';
interface IProgramcardProps {
    templateId: number | null | undefined, handleToggleProgramCheckbox: (param: string) => void, program: any, date: string
}

/**
 * Programcard component renders a card for each program in the program list
 * @param {IProgramcardProps} props 
 * @param {number | null | undefined} props.templateId template id
 * @param {Function} props.handleToggleProgramCheckbox function to toggle the program checkbox
 * @param {object} props.program program object
 * @param {string} props.date date string
 * @returns {JSX.Element} Programcard component
 */

const Programcard = ({ templateId, handleToggleProgramCheckbox, program, date }: IProgramcardProps) => {

    const methods = useFormContext();

    const { control, setValue, watch } = methods
    /**
     * Handles the click event on the view details button
     * Sets the isProgramDetailsModelOpen state to true and sets the programDetails state to the program object
     */
    function handleClickViewDetails() {

        setNonPersistedDataById('isProgramDetailsModelOpen', { value: true })

        setNonPersistedDataById('programDetails', { value: program })
    }


   

    const cart = useStore((state) => state?.nonPersistedData?.cart)


    /**
     * Handles the click event on the program card
     * If the program is already in the cart, it removes it
     * If the program is not in the cart, it adds it
     * @param {IProgram} program program object
     */


    function handleClick(programId: number) {

        const targetIndex = cart?.programIds?.findIndex((item: any) => item === programId)

        if (targetIndex !== -1) { 

            const updatedCart = [...cart?.programIds?.filter((item: any) => item !== programId)];
            
            setNonPersistedDataById('cart', { ...cart,programIds: updatedCart });
        }else {
            const updatedCart = [...cart?.programIds,programId];

            setNonPersistedDataById('cart', { ...cart,programIds:updatedCart });
        }

    }



    function isProgramInCart(programId: number) {
        return cart?.programIds?.includes(programId);
    }



return (
    <Grid size={{ xs: 12, md: 6, lg: 4 }} className={clsx(`program-card-${templateId} program-selection-program-card`, watch(`${formatDate(date)}-programs`)?.includes(program?.id) ? '' : '')} >


        <Box className="p-4">
            <Box className="flex justify-between">
                <Tooltip title={program?.name}>

                    <p className="text-2xl font-semibold mb-1">{truncateString(program?.name, 23)}</p>
                </Tooltip>

                <p onClick={handleClickViewDetails} className="underline cursor-pointer">View details</p>

            </Box>
            <Tooltip title={HTMLReactParser(program?.description || '')}>

                <p className="text-md font-normal">{truncateString(program?.description, 40)}</p>
            </Tooltip>
            <Box className="program-badge">
                <p className="text-md leading-none">Program</p>
            </Box>
        </Box>
        <Box className="divider"></Box>


        <Box display={"grid"} gridTemplateColumns={"1fr"} gap={2} padding={1} className="">
            <Box display={"flex"} columnGap={2} alignItems={"center"} className=" program-date-container">

                <CalendarMonthOutlinedIcon />

                <Box>
                    <p>Date</p>
                    <Box display={"flex"} alignItems={"center"} columnGap={1}>
                        <LocalTimeDate utcDateTime={program?.startTime} format="MMMM D YYYY" timezone="auto" fallbackText="Not Available" />
                        -
                        <LocalTimeDate utcDateTime={program?.startTime} format="MMMM D YYYY" timezone="auto" fallbackText="Not Available" />
                    </Box>


                </Box>


            </Box>
            <Box display={"flex"} columnGap={2} alignItems={"center"} className="time-container">

                <TimerOutlinedIcon />


                <Box >
                    <p>Time</p>
                    <Box display={"flex"} alignItems={"center"} columnGap={1}>
                        <Typography>
                            {moment(program?.startTime).format("h:mm A")}

                        </Typography>
                        -
                        <Typography>
                            {moment(program?.endTime).format("h:mm A")}

                        </Typography>


                    </Box>

                </Box>


            </Box>
        </Box>


        <Grid container spacing={2} alignItems="center">
            {(program.eventParticipantEntries || []).map((entry: any, index: any) => {
                const { seatAllocated = 0, totalSeat = 1 } = entry;
                const remainingSeat = totalSeat - seatAllocated;
                const bookedPercentage = (seatAllocated / totalSeat) * 100;
                const isOverbookedRed = bookedPercentage > 85;
                const isOverbookedYellow = bookedPercentage > 70;

                if (!isOverbookedYellow) return null;
                return (
                    <Grid container key={index} spacing={2} alignItems="center" paddingBottom={1}>
                        {/* Seat Information */}
                        <Grid container alignItems="center" spacing={0.5}>
                            <Grid paddingBottom={.5}>
                                {isOverbookedRed ? <RedSeat fontSize={15} /> : <YellowSeat fontSize={15} />}
                            </Grid>
                            <Grid>
                                <Typography variant="body1" className={isOverbookedRed ? "program-card-seat-alert-red" : "program-card-seat-alert-yellow"}>
                                    Only {remainingSeat} seats left!
                                </Typography>
                            </Grid>
                        </Grid>

                    </Grid>
                );
            })}
        </Grid>

        <Box className="divider"></Box>


        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} padding={1.6} >
            <Box className="">
                <Grid display={'flex'} alignItems={'center'} className="price-group">
                    <Dollar className="program-money-icon -mt-1" />
                    <Typography className='program-price'>{Math.trunc(Number(program?.amount)) === 0 ? "Free" : `${program?.amount}`}</Typography>
                </Grid>
            </Box>
            <Grid size={4} className={`program-checkbox-group-${templateId}`}>
                
                <CustomButton fullWidth startIcon={isProgramInCart(program?.id) ? <Check className="" /> :null} className={clsx(`program-card-btn-${templateId} program-card-btn`,  isProgramInCart(program?.id) &&`program-card-btn-${templateId}-active`)} label={isProgramInCart(program?.id) ? "Added" : "Add"} onClick={() => handleClick(program?.id) } />
            </Grid>
        </Box>
       
    </Grid>
)
}


export default Programcard
