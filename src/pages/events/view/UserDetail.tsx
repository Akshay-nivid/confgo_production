/**
 * userdetail page from event participant list
 * @author Nevin
 * view the programs of the user
 */

import { useCallback, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import apiClient from "@/Libs/Https/API-client";
import Grid from "@mui/material/Grid2";
import StatusComponent from "@/components/Status/StatusComponent";
import "./userdetail.scss";
import React from "react";
import {formatDateTimeRange } from "@/Utils/CommonBaseClass";
interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  statusId: string;
}

interface Program {
  id: string;
  name: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  speaker: string;
}

const UserDetail : React.FC = React.memo(() => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    eventParticipantList();
  }, [id]);

  /**
   * Fetches the participant details and associated program/event data for a specific user
   */
  const eventParticipantList = useCallback(async () => {
    try {
      const response = await apiClient.get(`/participant/${id}`);
      if (response.data.status === "Success") {
        const data = response.data.data;

        const userData = {
          id: data.details.user.id,
          firstName: data.details.user.firstName,
          lastName: data.details.user.lastName,
          phone: data.details.user.phone,
          email: data.details.user.email,
          statusId: data.details.user.statusId,
        };
        setUser(userData);

        const programData = data.programs.map((program: any) => ({
          id: program.event.id,
          name: program.event.title,
          location: program.event.venueId,
          startTime: program.event.startTime,
          endTime: program.event.endTime,
          status: program.event.statusId,
          speaker: program.event.speaker,
        }));
        setPrograms(programData);
      }
    } catch (error) {
      console.error("Error fetching participant data:", error);
    }
  }, [id]);

  if (!user) return;

  return (
    <Grid className="user-detail-card">
      <Grid className="user-detail-grid">
        <Grid display="flex">
          <Typography
            variant="h5"
            className="userdetail-title-name"
          >
            {user.firstName} {user.lastName}
          </Typography>
            {user.statusId && (
              <StatusComponent className="user-status" value={user.statusId} />
            )}
        </Grid>
        <Grid className="userdetail-title-personal">
          <Grid
            container
            spacing={6}
            size={{ xs: 12, sm: 6, md: 6 }}
            className="userdetail"
          >
            <Grid>
              <Typography className="userdetail-text" variant="subtitle1">
                Mobile Number
              </Typography>
              <Typography className="userdetail-data">{user.phone}</Typography>
            </Grid>
            <Grid>
              <Typography className="userdetail-text" variant="subtitle1">
                Email
              </Typography>
              <Typography className="userdetail-data">{user.email}</Typography>
            </Grid>
            <Grid>
              <Typography className="userdetail-text" variant="subtitle1">
                User ID
              </Typography>
              <Typography className="userdetail-data">{user.id}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Registered Programs Section */}
      <Typography variant="h6" className="userdetail-data">
        Registered Programs
      </Typography>
       <Grid container spacing={2}>
        {programs.map((program, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Grid className="userdetail-event-card">
              <Grid container direction="row" className="userdetail-time-status">
                <Typography className="userdetail-time" variant="subtitle2">
                {formatDateTimeRange({date:program.startTime,format:'h:mm A'})},{formatDateTimeRange({date:program.endTime,format:"h:mm A"})}
                </Typography>
                {program.status && (
                  <StatusComponent className="user-status" value={program.status} />
                )}
              </Grid>
              <Typography variant="h6" className="userdetail-name">
                {program.name}
              </Typography>
              <Typography variant="body2" className="userdetail-card-data">
                Location: {program.location}
              </Typography>
              <Typography variant="body2" className="userdetail-card-data">
                Speaker: {program.speaker}
              </Typography>
            </Grid>
          </Grid>
        ))}
     </Grid>
    </Grid>
  );
});

export default UserDetail;
