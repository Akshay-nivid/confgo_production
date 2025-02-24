import Grid from "@mui/material/Grid2";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import apiClient from "@/Libs/Https/API-client";
import { Logger } from "@/Utils/Logger";
import config from "../../../config.json";
import { Typography, Avatar, Box } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import routes from "@/router/routes";

interface Status {
  id: number;
  statusName: string;
  description: string;
}

interface Program {
  amount: string;
  companyId: number;
  description: string;
  discount: number | null;
  endTime: string;
  eventClass: string;
  id: number;
  interval: string;
  name: string;
  parentId: number;
  startTime: string;
  status: Status;
  statusId: number;
  title: string;
  venueId: number;
}

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  mapUrl: string;
  postalCode: string;
  country: string;
}

interface Addon {
  addons: Program[];
  amount: string;
  companyId: number;
  description: string;
  discount: number;
  endTime: string;
  eventClass: string;
  id: number;
  interval: string;
  name: string;
  programs: Program[];
  startTime: string;
  status: Status;
  statusId: number;
  title: string;
  venue: Venue;
  venueId: number;
  published: boolean;
  slugName: string;
  specialtyId: number;
  isAbstract: number;
  url: any;
  eventSpeakers: any;
}

/**
 * Card to show live event details in user dashboard 
 */
const OngoingEventCard = (id: any) => {
  const EventId = id?.data?.[0]?.id;
  const [eventFullData, setEventFullData] = useState<Addon>();
  const [_loading, setLoading] = useState(true);
  const baseUrl = config.api.url;
  const [speakerlist,setSpeakerList]=useState([])
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  /**
   * used to blink the live red dot 
  */
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 500); 
    return () => clearInterval(interval);
  }, []);

 /*
   * used to call the api
  */
  useEffect(() => {
    getEventDetails();
  }, [EventId]);

  /*
   * used to get the event details 
  */
  const getEventDetails = async () => {
    try {
        setLoading(true);
      const response = await apiClient.get(`event/${EventId}`);
      const { status, data } = processAPIResponse(response, "eventData");
      if (status) {
        setEventFullData(data);
        setSpeakerList(data?.eventSpeakers)
        setLoading(false);
      }
    } catch (error) {
      Logger.error("ViewEventDetail", error);
      setLoading(false)
    }
  };

  /*
   * Display only unique event speakers
  */
  const uniqueSpeakers = speakerlist?.reduce((acc:any, curr:any) => {
    if (!acc.some((speakers:any) => speakers?.userId === curr.userId)) {
      acc.push(curr);
    }
    return acc;
  }, []);
  
  return (
    <Grid className="ongoing-event-grid" onClick={() => navigate(routes.userEventRecap(), { state: { eventId: EventId } })}>
      <Grid className="ongoing-event-name-live-grid">
        <Typography className="ongoing-event-name">
          {eventFullData?.name}
        </Typography>
        <Box className="ongoing-event-live-dot">
          <Box className="ongoing-event-live"
            style={{
              opacity: isVisible ? 1 : 0,
            }}
          />
          <Typography>Live</Typography>
        </Box>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={4}>
          <Typography className="ongoing-event-detail">Date</Typography>
        </Grid>
        <Grid size={8}>
          <Typography className="ongoing-event-detail-display">
            {moment(eventFullData?.startTime).format("MMMM D, YYYY")}
          </Typography>
        </Grid>

        {eventFullData?.venueId ? (
          <>
            <Grid size={4}>
              <Typography className="ongoing-event-detail">Location</Typography>
            </Grid>
            <Grid size={8}>
              <Typography className="ongoing-event-detail-display">
                {eventFullData?.venue?.name}
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid size={4}>
              <Typography className="ongoing-event-detail">URL</Typography>
            </Grid>
            <Grid size={8}>
              <Typography className="ongoing-event-detail-display">
                {eventFullData?.url}
              </Typography>
            </Grid>
          </>
        )}

        <Grid size={4}>
          <Typography className="ongoing-event-detail">Type</Typography>
        </Grid>
        <Grid size={8}>
          <Grid
           className="ongoing-event-type" size={5}
          >
            {eventFullData?.eventClass}
          </Grid>
        </Grid>
        {uniqueSpeakers?.length > 0 && (
          <>
            <Grid size={4}>
              <Typography className="ongoing-event-detail">Speakers</Typography>
            </Grid>
            <Grid size={8}>
              <>
                <Grid className="card-content-heading">
                  <Grid
                    className="ongoing-event-speaker"
                    gap={1}
                  >
                    {uniqueSpeakers?.map(
                      (speaker: any, index: number) =>
                        index < 5 && (
                          <Grid
                            key={index}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            {speaker?.user?.assetId ? (
                              <Avatar
                                src={`${baseUrl}asset/${speaker?.user?.assetId}`}
                                alt={`${
                                  speaker.speakerFullName || "User Profile"
                                }`}
                                variant="circular"
                              />
                            ) : (
                              <Avatar className="session-speaker-avatar">
                                {`${speaker?.user?.firstName?.[0]}${
                                  speaker?.user?.lastName
                                    ? speaker?.user?.lastName?.[0]
                                    : ""
                                }`}
                              </Avatar>
                            )}
                          </Grid>
                        )
                    )}
                    {uniqueSpeakers?.length > 5 && (
                      <Grid
                        container
                        justifyContent={"flex-end"}
                        alignItems={"center"}
                      >{`...`}</Grid>
                    )}
                  </Grid>
                </Grid>
              </>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default OngoingEventCard;
