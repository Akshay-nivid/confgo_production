import React, { useState } from "react";
import { Typography, IconButton, Divider, Button, Menu, Avatar, Box } from "@mui/material";
import EditIcon from "@/assets/svg/event-edit.svg";
import Grid from "@mui/material/Grid2";
import { DeleteContributorIcon, HallIcon, SeatIcon, WarningIcon} from "@/assets/svg";
import CustomActionModal from "@/components/CustomActionModal/CustomActionModal";
import { formatedTimeRangeProgram, getLocalTimeDate, truncateString } from "@/Utils/CommonBaseClass";
import CustomModel from "@/components/CustomModel/CustomModel";
import { CloseOutlined } from "@mui/icons-material";
import { setDataById } from "@/Libs/store";
import AddOnIcon from "../../../assets/svg/addOnIcon.svg";
import ProgramIcon from "../../../assets/svg/programIcon.svg";
import { VectorMenu, PaymentHistoryIcon, CalenderIcon } from "@/assets/svg";
import SpeakerDetailsToolTip from "./ToolTipSpeaker/SpeakerDetailsToolTip";
import config from "../../../../config.json"
import moment from "moment";
import StatusComponent from "@/components/Status/StatusComponent";
interface FieldConfig {
  label: string;

  field: string;
  format?: (value: any) => string;
}
interface SessionCardProps {
  index?: any;
  item: any;
  onEditClick?: (item: any) => void;
  titleField: string;
  fields: FieldConfig[];
  startTimeField: string;
  endTimeField: string;
  hasAddOns?: boolean;
  optionsData?: [];
  timeCorrection?: boolean;
  onDeleteClick?: (item: any) => void;
}

interface AddOnOptions {
  label: string;
  value: number | string
}

/**
 * Component for listing data in a card format, dynamically rendering fields based on item type
 */
const SessionCard: React.FC<SessionCardProps> = ({
  item,
  onEditClick,
  titleField,
  // fields,
  startTimeField,
  endTimeField,
  hasAddOns = false,
  optionsData,
  timeCorrection,
  onDeleteClick,
}) => {

  // const modalState= useStore((state:any)=>state.compData?.['programModal']) ??[];
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  /**
   * Method checks if the date is valid or not
   * @param date 
   * @returns 
   */
  const isValidDate = (date: any) => {
    return moment(date, moment.ISO_8601, true).isValid();
  };

  /**
   * Method to convert date and time to datetime
   * @param dateString
   * @param timeString 
   * @returns 
   */
  const convertToDateTime = (dateString: any, timeString: any) => {
    return new Date(`${dateString}T${timeString}:00`);
  };

  /**
   * function to access nested properties in an object.
   * @param obj - Object to search.
   * @param path - Key path.
   * @returns Value at the specified key path.
   */
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  /**
  * render the selected addon property label from it's value using useMemo
  */
  const selectedLabel = React.useMemo(() => {
    const option: any = optionsData?.find((option: AddOnOptions) => option?.value === item?.addonId);
    return option ? option?.label : 'Unknown';
  }, [item?.addonId, optionsData]);

  const title = getNestedValue(item, titleField) || selectedLabel || "";
  /**
   * model for view certificate
   */
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const closeDrawer = () => {

    setDataById("programModal", { open })
    setOpen(false)
  };

  /**
  * @param index  Function to handle the event selection from the autocomplete input.
  * It updates the API request configuration based on the selected event.
  */
  const handleSquareButtonClick = () => {
    setDataById("programModal", { open })
    setOpen(true);
  };

  /**
  * handle vector 
  */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const opens = Boolean(anchorEl);
  const baseUrl = config.api.url;
  const handleClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosed = () => {
    setAnchorEl(null);
  };


  return (
    <Grid container spacing={0} size={{
      xs: 12,
      sm: 4,
      md: 3,
    }} flexDirection={"row"}
    >
      <Grid size={12} container className="event-sessions-session-card hover-shadow"  >
        <Grid container size={12} className="card-header">
          <Grid size={11} container>
            {hasAddOns ? (
              <>
                <AddOnIcon className="svg-icon" />
                <Grid container ><Typography className="card-header-tag">Add-On</Typography></Grid>
              </>
            ) : (
              <>
                <ProgramIcon className="svg-icon" />
                <Grid container > <Typography className="card-header-tag">Programs</Typography></Grid>
              </>
            )}
          </Grid>
          {onDeleteClick && onEditClick && (
            <Grid size={1} justifyContent={"flex-end"} className="card-header-menu">
              <Button
                className=""
                aria-controls={opens ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={opens ? 'true' : undefined}
                onClick={handleClicked} > <VectorMenu /></Button>
            </Grid>
          )}
          {/* menu for to delete and edit */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={opens}
            onClose={handleClosed}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <Grid className="card-header-menu-content">
              {onEditClick && (
                <IconButton
                  size="small"
                  className="event-detail-event-info-card-edit-btn"
                  onClick={() => {
                    handleClosed();
                    onEditClick(item)
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {onDeleteClick && (
                <IconButton
                  size="small"
                  className="event-detail-event-info-card-edit-btn"
                  onClick={() => {
                    handleClosed();
                    setDeleteModalOpen(true)
                  }}
                >
                  <DeleteContributorIcon fontSize="small" />
                </IconButton>
              )}
            </Grid>
          </Menu>

        </Grid>
        <Grid className="card-content" size={12} onClick={handleSquareButtonClick}>
          {!hasAddOns && (
            <>
              <Grid container size={12}>
                <Typography className="card-content-day">
                  {item && (` Day - ${moment(item?.startDate).format('dddd')}`)}
                </Typography>
              </Grid>
            </>
          )}


          <Grid container size={12}>
            <Typography className="card-content-heading">
              {truncateString(title, 25)}
            </Typography>
          </Grid>

          <Grid container size={12}>
            {onEditClick ? (
              <Typography className="card-content-description">
                {truncateString((item.description), 25, "Untitled")}
              </Typography>
            ) : (
              <Typography className="card-content-description">
                {truncateString((item.description), 18, "Untitled")}
              </Typography>)
            }

          </Grid>
          {(item.hall || item?.hallName?.hallName || item?.hallName) && (<Grid size={12} container spacing={1} display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
            <HallIcon />
            <Typography className="card-content-description">
              {truncateString(
                item?.hallName?.hallName || item?.hall || item?.hallName,
                25
              )}
            </Typography>
            {/* <Typography className="card-content-description">{truncateString(item?.hallName?.hallName ? item.hallName.hallName :item?.hall?item?.hall,25 :item?.hallName) }</Typography> */}
          </Grid>)}
          <Grid className="card-content-devider">
            <Divider />
          </Grid>


          {hasAddOns && item?.eventAddonProperties?.length > 0 && (
            item?.eventAddonProperties?.map((props: any) => (
              <Grid container size={12} key={props?.id}>
                <Grid display={"flex"} direction={"column"}>
                  <Typography className="card-content-description" >
                    {`Items: ${props?.name}`}-
                    {`Price: ${props?.amount}`}
                  </Typography>
                </Grid>
              </Grid>
            ))
          )}

          {!hasAddOns && item?.speakers && (
            <>
              <Grid className="card-content-heading" >
                <Grid className="card-content-heading" gap={1} minHeight="5rem" display={"flex"} direction={"column"}>

                  {item?.speakers?.map((speaker: any, index: number) => (
                    index < 5 && <Grid key={index} display="flex" alignItems="center" gap={1}>
                      {speaker?.speakerAssetId ? (
                        <Avatar
                          src={`${baseUrl}asset/${speaker?.speakerAssetId}`}

                          alt={`${speaker.speakerFullName || "User Profile"}`}
                          variant="circular"
                        />
                      ) : (
                        //className="main-user-profile main-user-profile-text"
                        <Avatar className="session-speaker-avatar">
                          {`${speaker?.speakerFullName?.[0]}${speaker?.speakerLastName ? speaker?.speakerLastName?.[0] : ""}`}
                        </Avatar>
                      )}

                    </Grid>
                  ))}
                  {item?.speakers?.length >= 5 && <Grid container justifyContent={'flex-end'} alignItems={'center'}>{`...`}</Grid>}
                </Grid>
              </Grid>
            </>
          )}



          {/* {
          !hasAddOns&&item?.eventSponsors&&(
            <>
                    <Grid className="card-content-heading" >
                      <Typography>Sponosrs</Typography>
                 <Grid className="card-content-heading"  gap={1}minHeight="5rem" display={"flex"}direction={"column"}>
                
                   {item?.eventSponsors?.map((sponsor: any, index: number) => (
                    index < 5 && <Grid key={index} display="flex" alignItems="center" gap={1}>
                        {sponsor?.sponsor?.logoAssetId ? (
                      <Avatar
                         src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
          
                            alt={`${sponsor?.sponsor?.name  || "User Profile"}`}
                              variant="circular"
                        />
                        ) : (
                          //className="main-user-profile main-user-profile-text"
                     <Avatar className="session-speaker-avatar">
                    {`${sponsor?.sponsor?.sponsor?.name?.[0]}`}
                    </Avatar>
                   )}
     
                    </Grid>
                        ))}
                       {item?.eventSponsors?.length >= 5 &&  <Grid container justifyContent={'flex-end'} alignItems={'center'}>{`...`}</Grid>}
                    </Grid>
                    </Grid>
            </>
          )
        }    
                         */}
          <Grid className="card-content-timeBox">
            <Typography className="time">
              {item[startTimeField] && item[endTimeField] ? (
                <span>
                  <Typography className="date-box-content">
                    <span>
                      {timeCorrection ? getLocalTimeDate(item[startTimeField]) : moment(item[startTimeField], "HH:mm").format("hh:mm A")}
                    </span>
                    {' - '}
                    <span>
                      {timeCorrection ? getLocalTimeDate(item[endTimeField]) : moment(item[endTimeField], "HH:mm").format("hh:mm A")}
                    </span>
                  </Typography>
                </span>
              ) : (
                <span>General Addon</span>
              )}
            </Typography>
          </Grid>

        </Grid>
      </Grid>

      {/* Delete Confirmation Modal */}
      <CustomActionModal
        icon={<WarningIcon className="unpublish-modal-icon" />}
        header="Delete Session"
        subHeader="Are you sure you want to delete this session? This action cannot be undone."
        cancelLabel="Cancel"
        submitLabel="Delete"
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        cancelAction={() => setDeleteModalOpen(false)}
        submitAction={() => {
          setDeleteModalOpen(false);
          onDeleteClick?.(item);
        }}

      />
      {/* program Details Modal */}
      <CustomModel
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid container className="event-sessions-program-modal" size={10}  >
          <Grid container size={6} className="display-container">

            <Grid container size={12} flexDirection={"column"}>

              <Grid container size={12} alignContent={'center'} justifyContent={'space-between'} className='session-modal-header'>
                <Grid size={{ xs: 11 }}>
                  <Typography className="session-modal-header-title">
                    {title}
                  </Typography>

                  <Typography className="session-modal-header-description">
                    {item[startTimeField] && item[endTimeField] ? (
                      <>
                        {formatedTimeRangeProgram(
                          isValidDate(item[startTimeField]) ? item[startTimeField] : convertToDateTime(item['startDate'] || item['date'], item['startTime']),
                          isValidDate(item[endTimeField]) ? item[endTimeField] : convertToDateTime(item['endDate'] || item['date'], item['endTime'])
                        )}
                      </>
                    ) : (
                      <span>General Addon</span>
                    )}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={closeDrawer} className="session-modal-close">
                    <CloseOutlined />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid p={2}>
                <Grid className="description-box" size={12}>

                  <Typography className="description-box-content">
                    {item?.description}
                  </Typography>
                </Grid>
                {hasAddOns && item?.eventAddonProperties?.length > 0 && (
                  <Grid container size={12} display={"flex"} flexDirection={"column"} className="addon-property" >
                    <Typography className="addon-header">Add-ons properties</Typography>
                    {item?.eventAddonProperties?.map((props: any) => (
                      <Grid display={"flex"} key={props.id} className="content pl-1 mt-1 " flexDirection={"column"}  >

                        <Box display="flex"  ><Typography className="content-head">Item-</Typography> <Typography className="content-data">{props?.name}</Typography></Box>

                        <Box display="flex" ><Typography className="content-head">Price-</Typography> <Typography className="content-data">{props?.amount}</Typography></Box>


                      </Grid>
                    ))}
                  </Grid>
                )}

                {item?.hall && (
                  <Grid className="description-box-content">
                    <Grid className="hall-grid">

                      <>
                        <HallIcon /> {item.hall}
                      </>

                    </Grid>
                  </Grid>)}
                {!hasAddOns && (
                  <>
                  {item?.eventParticipantEntries?.[0]?.totalSeat && (

                    <Grid size={12} display={"flex"} flexDirection={"column"} className="seat-box" >

                      <Typography className="seat-box-heading">
                        Total Seats
                      </Typography>

                      <Typography display={"flex"} gap={1} alignItems={"center"}className="seat-box-heading" >

                        <SeatIcon />

                        {item?.eventParticipantEntries?.[0]?.totalSeat}

                      </Typography>

                    </Grid>)}
                   
                

                    {item?.speakers && item?.speakers?.length !== 0 &&
                      <Grid className="speaker-box" size={12} minHeight={"5rem"} >

                        <Typography className="speaker-box-heading">
                          Speakers
                        </Typography>

                        <Grid className="card-content-heading" gap={1} minHeight="5rem" display={"flex"} direction={"column"} >
                          {item?.speakers?.map((speaker: any, index: number) => (
                            <Grid key={index} display="flex" alignItems="center" gap={1} >
                              <SpeakerDetailsToolTip className="speaker-box-toolTip" title={<>
                                {speaker?.speakerAssetId ? (
                                  <Avatar
                                    src={`${baseUrl}asset/${speaker?.speakerAssetId}`}
                                    // className="main-user-profile"
                                    alt={`${speaker?.speakerFullName || "User Profile"}`}
                                    variant="circular"
                                  />
                                ) : (

                                  <Avatar className="session-speaker-modal-avatar">
                                    {`${speaker?.speakerFullName?.[0]}${speaker?.speakerLastName ? speaker?.speakerLastName?.[0] : ""}`}
                                  </Avatar>
                                )}
                              </>} >
                                <Grid direction={"column"} display={"flex"} size={12} >
                                  <Grid size={2}>
                                    {speaker?.speakerAssetId ? (
                                      <Avatar
                                        src={`${baseUrl}asset/${speaker?.speakerAssetId}`}
                                        // className="main-user-profile"
                                        alt={`${speaker.speakerFullName || "User Profile"}`}
                                        variant="circular"
                                      />
                                    ) : (
                                      <Avatar className="session-speaker-modal-avatar">
                                        {`${speaker?.speakerFullName?.[0]}${speaker?.speakerLastName ? speaker?.speakerLastName?.[0] : ""}`}
                                      </Avatar>
                                    )}
                                  </Grid>
                                  <Grid size={10} marginLeft={"2rem"}>

                                    <Typography className="modal-speaker-name">{`${speaker?.speakerFullName} ${speaker?.speakerLastName ? speaker?.speakerLastName : ""}`}</Typography>
                                    <Typography className="modal-speaker-name-designation">{speaker?.designation}</Typography>

                                  </Grid>
                                </Grid>
                              </SpeakerDetailsToolTip>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    }
                  </>
                )}
                {hasAddOns && (
                  <>
                    {item?.sponsor && item.sponsor.length !== 0 && (
                      <Grid className="speaker-box" size={12} minHeight={"5rem"} >
                        <Typography className="speaker-box-heading">
                          Sponsors
                        </Typography>
                        <Grid className="card-content-heading" gap={1} minHeight="5rem" display={"flex"} direction={"column"} >
                          {item?.sponsor?.map((sponsor: any, index: number) => (
                            <Grid key={index} display="flex" alignItems="center" gap={1} >
                              <SpeakerDetailsToolTip className="speaker-box-toolTip" title={<>
                                {sponsor?.sponsorAssetId ? (
                                  <Avatar
                                    src={`${baseUrl}asset/${sponsor?.sponsorAssetId}`}
                                    alt={`${sponsor?.sponsorFullName || "User Profile"}`}
                                    variant="circular"
                                  />
                                ) : (
                                  <Avatar className="session-speaker-modal-avatar">
                                    {`${sponsor?.sponsorFullName?.[0]}`}
                                  </Avatar>
                                )}
                              </>} >
                                <Grid direction={"column"} display={"flex"} size={12} >
                                  <Grid size={2}>
                                    {sponsor?.sponsor?.logoAssetId ? (
                                      <Avatar
                                        src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                        // className="main-user-profile"
                                        alt={`${sponsor?.sponsorFullName || "User Profile"}`}
                                        variant="circular"
                                      />
                                    ) : (
                                      <Avatar className="session-speaker-modal-avatar">
                                        {`${sponsor?.sponsorFullName?.[0]}`}
                                      </Avatar>
                                    )}
                                  </Grid>
                                  <Grid size={10} marginInline={"2rem"}>
                                    <Typography className="modal-speaker-name">{`${sponsor?.sponsorFullName}`}</Typography>
                                  </Grid>
                                </Grid>
                              </SpeakerDetailsToolTip>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                  </>
                )}
                {!hasAddOns && (
                  <>
                    {item?.sponsor && item?.sponsor?.length !== 0 &&
                      <Grid className="speaker-box" size={12} minHeight={"5rem"} >
                        <Typography className="speaker-box-heading">
                          Sponsors
                        </Typography>
                        <Grid className="card-content-heading" gap={1} minHeight="5rem" display={"flex"} direction={"column"} >
                          {item?.sponsor?.map((sponsor: any, index: number) => (
                            <Grid key={index} display="flex" alignItems="center" gap={1} >
                              <SpeakerDetailsToolTip className="speaker-box-toolTip" title={<>
                                {sponsor?.sponsorAssetId ? (
                                  <Avatar
                                    src={`${baseUrl}asset/${sponsor?.sponsorAssetId}`}
                                    // className="main-user-profile"
                                    alt={`${sponsor?.sponsorFullName || "User Profile"}`}
                                    variant="circular"
                                  />
                                ) : (
                                  <Avatar className="session-speaker-modal-avatar">
                                    {`${sponsor?.sponsorFullName?.[0]}`}
                                  </Avatar>
                                )}
                              </>} >
                                <Grid direction={"column"} display={"flex"} size={12} >
                                  <Grid size={2}>
                                    {sponsor?.sponsor?.logoAssetId ? (
                                      <Avatar
                                        src={`${baseUrl}asset/${sponsor?.sponsor?.logoAssetId}`}
                                        // className="main-user-profile"
                                        alt={`${sponsor?.sponsorFullName || "User Profile"}`}
                                        variant="circular"
                                      />
                                    ) : (
                                      <Avatar className="session-speaker-modal-avatar">
                                        {`${sponsor?.sponsorFullName?.[0]}`}
                                      </Avatar>
                                    )}
                                  </Grid>
                                  <Grid size={10} marginInline={"2rem"}>
                                    <Typography className="modal-speaker-name">{`${sponsor?.sponsorFullName}`}</Typography>
                                    <Typography className="modal-speaker-name-designation"> Reserved Seats:{sponsor?.sponsorReservedSeats ?? "Null"}</Typography>
                                  </Grid>
                                </Grid>
                              </SpeakerDetailsToolTip>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    }
                  </>
                )}
                <Grid container spacing={2}>
                  {item?.checkInTime &&
                    <Grid container size={12} display={"flex"} flexDirection={"row"} >
                       <CalenderIcon fontSize="small" />
                       <Typography className="checkin-time-label">Check-in Time</Typography>
                       <Typography className="checkin-time-value">{item?.checkInTime || "--:--"}</Typography>
                    </Grid>
                  }
                  {item?.paymentStatus &&
                    <Grid container size={12} display={"flex"} flexDirection={"row"}>
                      <PaymentHistoryIcon fontSize="small" />
                      <Typography className="payment-info-label">Payment Information</Typography>
                      <Grid>
                      <StatusComponent value={item?.paymentStatus === "COMPLETED" ? '12' : "3"} />
                      </Grid>
                    </Grid>
                  }
                </Grid>
              </Grid>

            </Grid>

          </Grid>

        </Grid>

      </CustomModel>
    </Grid>
  );
};

export default SessionCard;