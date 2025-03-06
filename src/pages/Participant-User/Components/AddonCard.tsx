import { Dollar } from '@/assets/svg'
import { Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import moment from 'moment'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { formatDate } from '../Program-Selection/programsHandlers'
import clsx from 'clsx'
import { convertUTCToUserTimeZone, truncateString } from '@/Utils/CommonBaseClass';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Badge from './Badge';
import { useFormContext } from 'react-hook-form';

import CheckIcon from '@mui/icons-material/Check';
import useProgramAddonToggle from '../Program-Selection/useProgramAddonToggle';
import { snackBar } from '@/Libs/store';

interface IProgramcardProps {
  templateId: number | null | undefined, addon: any, date: string
}
/**
 * AddonCard component renders a single add-on event card with 
 * basic information like name, description, date, time and price.
 * It also renders a list of add-on properties with checkboxes
 * to select desired properties. At the bottom of the component
 * there is a checkbox to select/unselect the add-on.
 * @param {IProgramcardProps} props - An object containing
 * templateId, addon, date and onToggleAddonCheckBox function.
 * @returns {JSX.Element} - A single add-on event card component.
 */
const AddonCard = ({ templateId, addon, date }: IProgramcardProps) => {


  const methods = useFormContext();

  const { watch } = methods




  const { isAddonProp, handleClickAddonProp, handleAddonClick, isAddonInCart } = useProgramAddonToggle()

  return (
    <Grid size={{ xs: 12, md: 6, lg: 4 }} className={clsx(`addon-card-${templateId} program-selection-addon-card`, watch(`${formatDate(date)}-programs`)?.includes(addon?.id) ? '' : '')} >

      {/* <Box className="border border-orange-200 px-2 font-medium rounded-md ml-auto w-max bg-orange-100">
        <Typography fontWeight={500}>Add-on</Typography>
      </Box> */}
      <Box className={"badge-container"}>
        <Badge text="Add-on" type="addon" />

      </Box>
      <Box display={'flex'} flexDirection={'column'} className="addon-container">
        <Box className="addon-header">

          <Typography className='addon-name'>  {truncateString(addon?.addon?.name, 50)}</Typography>
          <Typography className="addon-description"> {truncateString(addon?.description, 50)}</Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"} className="addon-date-container">
          <CalendarMonthOutlinedIcon className='icon' />
          {/* {addon?.startTime ? <LocalTimeDate utcDateTime={addon?.startTime} format="MMMM D" timezone="auto" fallbackText="Not Available" /> : "NA"} */}
          {convertUTCToUserTimeZone(addon?.startTime, "MMMM D")}
          <Typography>-</Typography>
          {convertUTCToUserTimeZone(addon?.endTime, "MMMM D")}

          {/* {addon?.endtime ? <LocalTimeDate utcDateTime={addon?.endTime} format="MMMM D" timezone="auto" fallbackText="Not Available" /> : 'NA'} */}
        </Box>

        <Box display={"flex"} alignItems={"center"} className="addon-time-container">
          <TimerOutlinedIcon className='icon' />
          {addon?.startTime ? <Typography className='addon-time'>
            {moment(addon?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(addon?.endTime).format("h:mm A")}
          </Typography> : 'NA'}
        </Box>

      </Box>

      <Box className="divider"></Box>
      <Box className="addon-footer">

        {(addon?.eventAddonProperties && addon?.eventAddonProperties?.length > 0) ? (
          <Grid size={12} className="addon-property-list-container" container rowSpacing={1} columnSpacing={2}>

            {addon?.eventAddonProperties?.length > 0 && addon.eventAddonProperties.map((property: any) => (
              <Grid size={12} display={'flex'} alignItems={'center'} className={`addon-property-checkbox-group-${templateId}`}>

                <Box className="flex items-center w-full ">
                  {(addon?.startTime && new Date(addon?.startTime) >= new Date()) ? <CustomAddonProButton templateId={templateId} onClick={() => {
                    if (addon?.startTime && new Date(addon?.startTime) < new Date()) {
                      snackBar({ severity: 'error', message: 'The program has already started or expired.' })
                    } else {
                      handleClickAddonProp(property)
                    }
                  }} className={isAddonProp(property) ? `addon-property-checkbox-${templateId}-active` : ''} /> : <p className='text-xl text-red-700'>Expired</p>}
                  <Box display={'flex'} mt={.6} alignItems={'center'} flex={1}>

                    <Typography className="addon-prop-label ">{property?.name}</Typography>
                    <Typography>-</Typography>
                    <Box className="flex items-center justify-between ml-auto">
                      <Dollar className='addon-prop-money-icon -mt-1' />
                      <Typography className="addon-prop-amount">{Math.trunc(Number(property?.amount)) === 0 ? "Free" : `${property?.amount}`}</Typography>
                    </Box>
                  </Box>

                </Box>
              </Grid>
            ))}
          </Grid>
        ) :

          <Grid size={12} display={'flex'} alignItems={'center'} className={`addon-property-checkbox-group-${templateId}`}>
            {(addon?.startTime && new Date(addon?.startTime) >= new Date()) ? <CustomAddonProButton templateId={templateId} onClick={() => {
              if (addon?.startTime && new Date(addon?.startTime) < new Date()) {
                snackBar({ severity: 'error', message: 'The program has already started or expired.' })
              } else {
                handleAddonClick(addon?.id)
              }
            }} className={isAddonInCart(addon?.id) ? `addon-property-checkbox-${templateId}-active` : ''} /> : <p className='text-xl text-red-700'>Expired</p>}

            <Box className="flex items-center w-full">
              {(addon?.startTime && new Date(addon?.startTime) >= new Date()) ?
                <>
                  <Typography className="addon-prop-label">{addon?.addon?.name}</Typography>
                  <Typography>-</Typography>
                </>
                : ''}
              {Math.trunc(Number(addon?.amount)) === 0 ? <Box className="flex items-center justify-between ml-auto ">
                <Typography className="addon-prop-amount "> Free </Typography>
              </Box>
                :
                <Box className="flex items-center justify-between ml-auto ">
                <Dollar className='addon-prop-money-icon -mt-1' />
                <Typography className="addon-prop-amount">{addon?.amount}</Typography>
              </Box>
            }

            </Box>
          </Grid>
        }
      </Box>
    </Grid>
  )
}

export default AddonCard




const CustomAddonProButton = ({ onClick, className, templateId }: { onClick: () => void, className: string, templateId: number | null | undefined }) => {
  return (
    <Box onClick={onClick} className={clsx("addon-property-checkbox", `addon-property-checkbox-${templateId}`, className)}>
      {
        className === `addon-property-checkbox-${templateId}-active` ? <CheckIcon className='addon-property-checkbox-icon' /> : ''
      }
    </Box>
  )
}


