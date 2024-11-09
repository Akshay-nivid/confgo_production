import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { useState, Key } from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import { Logger } from "@/Utils/Logger";
import SessionDrawerContent from "./SessionDrawercontent";
import SessionCard from "./sessionCard";
import useStore from "@/Libs/store";
interface SessionsProps {
  eventData: any;
}

interface Program {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  isPaid: "PAID" | "FREE";
  amount: number;
}
/**
 *  Componet to list the sessions
 */
const Sessions: React.FC<SessionsProps> = ({ eventData }) => {
    const session = useStore((state) => state?.compData?.["sessions"]) ?? {};
      const { drawerOpen, isEditing, isAddon } = session;
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [programs, setPrograms] = useState(eventData.programs || []);
  const addons = eventData.addons || [];
  const parentId = eventData.id;
  const POST = useStore((state) => state.POST);
  const setDataById = useStore((state) => state.setDataById);

  /**
   * Function used at while adding
   */
  const handleAddClick = () => {

    setDataById('sessions', {drawerOpen:true, isEditing:false, idAddon:false, showPriceField:false})
  };


  const closeDrawer = () => setDataById('sessions', {drawerOpen: false});
  /**
   * Function used at while editing the sessions
   */
  const handleEditClick = (item: any) => {
    const id = item.id;
    if (item.type === "program") {
      setSelectedProgram({
        ...item,
        isPaid: item.amount > 0 ? "PAID" : "FREE",
      });
      setSelectedProgramId(id);
      setDataById('sessions', {isEditing: true, isAddon:false})
    } else if (item.type === "addon") {
      setSelectedProgram({
        ...item,
        isPaid: "FREE",
      });
      setDataById('sessions', {isEditing: false, isAddon: true})
    }
    setDataById('sessions', {drawerOpen: true})
  };

  /**
   * Submiting the datas according to the conditions
   */
  const onSubmit = async (data: any) => {
    closeDrawer();
    if (data.isPaid === "FREE") {
      data.amount = parseInt("0");
    } else {
      data.amount = data.price || 0;
    }
    const programData = {
      ...data,
      programType: data.programType,
      isPaid: data.isPaid,
      ...(isEditing ? {} : { parentEventId: parentId }), // Include parentId only when adding a new program
    };

    try {
        const url = isEditing && selectedProgramId 
          ? `/event/update/${selectedProgramId}`
          : isAddon 
            ? `/addon/add` 
            : `/event/program/add`;
      
        const successCB = (response: any) => {
          if (isEditing && selectedProgramId) {
            setPrograms((prevPrograms: { id: any }[]) =>
              prevPrograms.map((prog: { id: any }) =>
                prog.id === selectedProgramId ? { ...prog, ...programData } : prog
              )
            );
          } else {
            if (isAddon) {
              addons((prevAddons:any) => [...prevAddons, response.data]);
            } else {
              setPrograms((prevPrograms:any) => [...prevPrograms, response.data]);
            }
          }
          Logger.info("Operation successful:", response.data);
        };
      
        const errorCB = (error: any) => {
          const action = isEditing ? "updating" : "adding";
          Logger.error(`Error ${action} program/addon`, error);
        };
      
        POST({
          url,
          body: programData,
          id: isEditing ? "updateProgram" : "addProgramOrAddon",
          successCB,
          errorCB,
        });
      } catch (error) {
        Logger.error("Error processing data:", error);
      } 
  };

  // Combine and sort programs and addons by startTime in ascending order
  const combinedItems = [
    ...programs.map((item: any) => ({ ...item, type: "program" })),
    ...addons.map((item: any) => ({ ...item, type: "addon" })),
  ].sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));

  // Group sorted items by date
  const groupedData = combinedItems.reduce((acc, program) => {
    const date = moment(program.startTime).isValid()
      ? moment(program.startTime).format("YYYY-MM-DD")
      : "Invalid Date";

    if (date === "Invalid Date") {
      if (!acc.invalid) acc.invalid = [];
      acc.invalid.push(program);
    } else {
      if (!acc[date]) acc[date] = [];
      acc[date].push(program);
    }

    return acc;
  }, {});
  return (
    <Grid container spacing={3} className="event-sessions-sessions-container">
      <Grid
        size={{ xs: 12 }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h3" className="event-detail-event-info-card-title">
          Event Sessions
        </Typography>
        <CustomButton
          className="event-detail-speakers-card-speaker-add-button"
          variant="outlined"
          label=" + Add Program"
          onClick={handleAddClick}
        />
      </Grid>

      {/* Show invalid date items first */}
      {groupedData.invalid && (
        <Grid size={{ xs: 12 }} key="invalid">
          <Grid container spacing={2} className="event-sessions-session-list">
            {groupedData.invalid.map(
              (item:  { addon: { name: any } }, index: Key | null | undefined) => (
                <SessionCard
                  key={index}
                  item={item}
                  onEditClick={handleEditClick}
                  titleField="name"
                  hasAddOns={item.addon ? true : false}
                  startTimeField="startTime"
                  endTimeField="endTime"
                  fields={[
                    { label: "Description", field: "description" },
                    {
                      label: "Price",
                      field: "amount",
                      format: (value) => (value > 0 ? `${value}` : "Free"),
                    },
                  ]}
                />
              )
            )}
          </Grid>
        </Grid>
      )}

      {/* Render valid date items */}
      {Object.keys(groupedData)
        .filter((date) => date !== "invalid")
        .map((date) => (
          <Grid size={{ xs: 12 }} key={date}>
            <Box
              className="event-sessions-date-header"
              display="flex"
              alignItems="center"
            >
              <DateRangeIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                {moment(date).format("MMMM D YYYY")}
              </Typography>
            </Box>

            <Grid container spacing={2} className="event-sessions-session-list">
              {groupedData[date].map(
                (
                  item: { addon: { name: any } },
                  index: Key | null | undefined
                ) => (
                  <SessionCard
                    key={index}
                    item={item}
                    hasAddOns={item.addon ? true : false}
                    onEditClick={handleEditClick}
                    titleField={
                      item.addon && item.addon.name ? "addon.name" : "name"
                    }
                    startTimeField="startTime"
                    endTimeField="endTime"
                    fields={[
                      {
                        label: "Description",
                        field: item.addon ? "addon.description" : "description",
                      },
                      {
                        label: "Price",
                        field: "amount",
                        format: (value) => (value > 0 ? `${value}` : "Free"),
                      },
                    ]}
                  />
                )
              )}
            </Grid>
          </Grid>
        ))}
      <CustomDrawer
        open={drawerOpen}
        type="right"
        children={
          <SessionDrawerContent
            isEditing={isEditing}
            isAddon={isAddon}
            selectedProgram={selectedProgram}
            onSubmit={onSubmit}
            closeDrawer={closeDrawer}
          />
        }
      />
    </Grid>
  );
};

export default Sessions;
