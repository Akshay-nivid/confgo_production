/**
 * userdetail page from event participant list
 * @author Nevin
 * view the programs of the user
 */

import { useCallback, useEffect, useState } from "react";
import { Typography,Avatar, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import apiClient from "@/Libs/Https/API-client";
import Grid from "@mui/material/Grid2";
import StatusComponent from "@/components/Status/StatusComponent";
import "./userdetail.scss";
import React from "react";
import { CallingIcon, MailIcon } from "@/assets/svg";
import UserAllDetail from "./userAllDetail";
import config from "../../../../config.json";
import SessionCard from "./sessionCard";
interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  statusId: string;
  assetId:string;
  roleName:string;
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

const UserDetail: React.FC = React.memo(() => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userdetailData,setuserdetailData]=useState()
  const [programs, setPrograms] = useState<Program[]>([]);
  const baseUrl = config.api.url;
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
        
        const data = response?.data?.data;
        
        setuserdetailData(data);

        const userData = {
          id: data?.details?.user?.id,
          firstName: data?.details?.user?.firstName,
          lastName: data?.details?.user?.lastName,
          phone: data?.details?.user?.phone,
          email: data?.details?.user?.email,
          statusId: data?.details?.user?.statusId,
          assetId: data?.details?.user?.assetId,
          roleName: data?.programs?.[0]?.roleName,
        };

        setUser(userData);
        const programData = data?.programs
          .filter((program: any) => program.event)
          .map((program: any) => ({
            id: program.event?.id,  
            name: program.event?.name, 
            location: program.event?.venue? `${program.event.venue.city},${program.event.venue.country}`:'Unknown',
            startTime: program.event?.startTime,
            endTime: program.event?.endTime,
            status: program.event?.statusId,
            speaker: program.event?.speaker,
            description: program.event?.description,
            speakers:program.event?.eventSpeakers?.map(({ user, ...event }:any) => ({...event,...user,  speakerAssetId: user.assetId})) || []
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
    <Grid container className="user-detail-grid" spacing={2}>
      {/* Avatar Section */}
      <Grid>
        {user?.assetId ? (
          <Avatar
            src={`${baseUrl}asset/${user?.assetId}`}
            className="userdetail-avatar"
            alt="User Profile"
            variant="circular"
          />
        ) : (
          <Avatar className="userdetail-avatar main-user-profile-text">
            {`${user?.firstName[0]}${user?.lastName[0]}`.toUpperCase()}
          </Avatar>
        )}
      </Grid>
      {/* User Info Section */}
      <Grid>
        {/* Name and Status */}
        <Grid display="flex" alignItems="center">
          <Typography variant="h5" className="userdetail-title-name">
            {user.firstName} {user.lastName}
          </Typography>
          {user.statusId && (
            <StatusComponent className="user-status" value={user.statusId.toString()}/>
          )}
        </Grid>
        
        {/* Role Name */}
        <Typography className="userdetail-subtitle">{user.roleName}</Typography>
      </Grid>
    </Grid>

      {/* Contact Details */}
      <Grid className="userdetail-title-personal" container direction="row" alignItems="center" spacing={2}>
          <Grid container direction="row" className="userdetail-data-grid">
            <CallingIcon className="userdetail-data-image"/>
            <Typography className="userdetail-data">{user.phone}</Typography>
          </Grid>
          <Grid container direction="row" className="userdetail-data-grid">
            <MailIcon className="userdetail-data-image"/>
            <Typography className="userdetail-data">{user.email}</Typography>
          </Grid>
        </Grid>
        <Grid className="userdetail-divider">
        <Divider  />
        </Grid>
      {/* Registered Programs Section */}
      <Typography variant="h6" className="userdetail-data-title">
        Registered Programs
      </Typography>
      <Grid container spacing={2} className="event-sessions-session-list">
        {programs.map((item: any, index: number) => {
          return (
            <SessionCard
              key={index}
              index={index + 1}
              item={item}
              timeCorrection={true}
              hasAddOns={item?.eventAddonId ? true : false}
              titleField={"name"}
              startTimeField="startTime"
              endTimeField="endTime"
              fields={[]}
            />
          );
        }
        )}

      </Grid>
      <Grid className="userdetails-alldetails">
      <UserAllDetail userdetail={userdetailData}/>
      </Grid>
    </Grid>
  );
});

export default UserDetail;
