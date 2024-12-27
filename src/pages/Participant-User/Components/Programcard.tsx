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
import Badge from './Badge';
import { useFormContext } from 'react-hook-form';
interface IProgramcardProps {
    templateId:number | null | undefined, handleToggleProgramCheckbox:(param:string)=>void, program:any, date:string 
}

const Programcard = ({  templateId, handleToggleProgramCheckbox, program, date }:IProgramcardProps) => {

    const methods = useFormContext();

    const {control,setValue,watch} = methods




    return (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} className={clsx( `program-card-${templateId}`, watch(`${formatDate(date)}-programs`)?.includes(program?.id) ? '' : '')} >
         
            <Badge text="Program" type="program" />

            <Grid size={12}>
                <Tooltip title={program?.name}>
                    <Typography className='card-title'> {truncateString(program?.name, 23)}</Typography>
                </Tooltip>
                <Tooltip title={program?.description}>
                    <Typography className=" program-descritption">{truncateString(program?.description, 23)} </Typography>

                </Tooltip>

                <Box  className="date-time-container">
                    <CalendarMonthOutlinedIcon/>
                    <LocalTimeDate utcDateTime={program?.startTime} format="MMMM D" timezone="auto" fallbackText="Not Available" />
                    <Typography>-</Typography>
                    <LocalTimeDate utcDateTime={program?.endTime} format="MMMM D" timezone="auto" fallbackText="Not Available" />

                </Box>

                <Box className=" time-container">
                    <TimerOutlinedIcon />
                    <Typography >
                        {moment(program?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(program?.endTime).format("h:mm A")}
                    </Typography>
                </Box>
                
            </Grid>

            <Grid display={'flex'} alignItems={'center'}  className="price-group">
                <Dollar className="program-money-icon" />
                <Typography className='program-price'>{Math.trunc(Number(program?.amount)) === 0 ? "Free" : `${program?.amount}`}</Typography>
            </Grid>

            <Box className="program-checkbox-wrapper">
                <Grid size={12} className={`program-checkbox-group-${templateId}`}>
                    <CustomCheckbox
                        onChange={() => handleToggleProgramCheckbox(`${formatDate(date)}-programs`)}
                        control={control}
                        className="program-item-checkbox"
                        id={program?.id}
                        name={`${formatDate(date)}-programs`}
                        setValue={setValue}
                        options={[
                            {
                                label: '',
                                value: program?.id,
                            },
                        ]}
                    />
                    <Typography className="add-text">{watch(`${formatDate(date)}-programs`)?.includes(program?.id) ? <> Remove <DeleteIcon /> </> : <> Add <AddIcon /> </>}</Typography>
                </Grid>
            </Box>
        </Grid>
    )
}

export default Programcard


