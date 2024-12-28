import { Dollar } from '@/assets/svg'
import { Typography, Box } from '@mui/material'
import Grid from '@mui/material/Grid2'
import moment from 'moment'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import CustomCheckbox from '@/components/CustomCheckbox/CustomCheckbox'
import { formatDate } from '../Program-Selection/programsHandlers'
import clsx from 'clsx'
import { truncateString } from '@/Utils/CommonBaseClass';
import LocalTimeDate from '@/components/LocalTimeDate/LocalTimeDate';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Badge from './Badge';
import { useFormContext } from 'react-hook-form';


interface IProgramcardProps {
  templateId: number | null | undefined, onToggleAddonCheckBox: (param: string) => void, addon: any, date: string
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

  const { control, watch } = methods

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} className={clsx(`addon-card-${templateId}`, watch(`${formatDate(date)}-programs`)?.includes(addon?.id) ? '' : '')} >

      {/* <Box className="border border-orange-200 px-2 font-medium rounded-md ml-auto w-max bg-orange-100">
        <Typography fontWeight={500}>Add-on</Typography>
      </Box> */}
      <Badge text="Add-on" type="addon" />
      <Box display={'flex'} flexDirection={'column'}>
        <Typography  className='addon-name'>  {truncateString(addon?.addon?.name, 23)}</Typography>
        <Typography className="addon-description"> {truncateString(addon?.description, 23)}</Typography>

        <Box className="date-time-container">
          <CalendarMonthOutlinedIcon />
          <LocalTimeDate utcDateTime={addon?.startTime} format="MMMM D" timezone="auto" fallbackText="Not Available" />
          <Typography>-</Typography>
          <LocalTimeDate utcDateTime={addon?.endTime} format="MMMM D" timezone="auto" fallbackText="Not Available" />
        </Box>

        <Box  className="time-container">
          <TimerOutlinedIcon />
          <Typography className='addon-time'>
            {moment(addon?.startTime).format("h:mm A") + ' ' + '-' + ' ' + moment(addon?.endTime).format("h:mm A")}
          </Typography>
        </Box>

      </Box>

      <Box className="divider"></Box>
      {(addon?.eventAddonProperties && addon?.eventAddonProperties?.length > 0) ? (
        <Grid size={12}  className="addon-property-list-container" container columnSpacing={2}>

          {addon.eventAddonProperties.map((property: any) => (
            <Grid size={12} display={'flex'} alignItems={'center'} className={`addon-property-checkbox-group-${templateId}`}>
              < CustomCheckbox
                className="addon-prop-checkbox"
                key={`${property?.id}-${property?.name}-${addon?.addonId}`}
                // disabled={watch(currentAddon) === undefined || watch(currentAddon).length === 0}
                row={true}
                control={control}
                required={false}
                name={`${formatDate(date)}-addonProp-${addon?.id}`}
                options={[
                  { label: '', value: property?.id },
                ]}
              />
              <Box className="flex items-center w-full">
                <Typography className="addon-prop-label">{property?.name}</Typography>
                <Typography>-</Typography>
                <Box className="flex items-center">
                  <Dollar className='addon-prop-money-icon' />
                  <Typography className="addon-prop-amount">{Math.trunc(Number(property?.amount)) === 0 ? "Free" : `${property?.amount}`}</Typography>
                </Box>

              </Box>
            </Grid>
          ))}
        </Grid>
      ) : <></>}
      {/* <Box className="absolute left-5 right-5 bottom-4">
        <Box className={`addon-checkbox-group-${templateId}`}>
          <CustomCheckbox

            control={control}
            className="program-item-checkbox"
            onChange={() => {
              onToggleAddonCheckBox(`${formatDate(date)}-addon-${addon?.id}`)
            }}
            id={addon?.addonId}
            name={`${formatDate(date)}-addon-${addon?.id}`}
            setValue={setValue}
            options={[
              {
                label: '',
                value: addon?.id,
              },
            ]}
          />


          <Typography className="add-text">{watch(`${formatDate(date)}-addon-${addon?.id}`)?.includes(addon?.id) ? <> Remove <DeleteIcon /> </> : <> Add <AddIcon /> </>}</Typography>
        </Box>
      </Box> */}
    </Grid>
  )
}

export default AddonCard
