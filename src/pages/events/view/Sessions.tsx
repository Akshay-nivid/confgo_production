import { Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { useState, useEffect, Key } from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
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
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showPriceField, setShowPriceField] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddon, setIsAddon] = useState<boolean>(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [addOnOptions, setAddOnOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [programs, setPrograms] = useState(eventData.programs || []);
  const addons = eventData.addons || [];
  const [editorContent, setEditorContent] = useState<string>("");
  const parentId = eventData.id;
  const POST = useStore((state: any) => state.POST);

  /**
   * Function used at while adding
   */
  const handleAddClick = () => {
    setShowPriceField(false);
    setIsEditing(false);
    setIsAddon(false);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

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
      setIsEditing(true);
      setIsAddon(false);
    } else if (item.type === "addon") {
      setSelectedProgram({
        ...item,
        isPaid: "FREE",
      });
      setIsEditing(false);
      setIsAddon(true);
    }
    setDrawerOpen(true);
  };

  /**
   * To get the list of addons
   */
  const handleAddOnOptionsApiCall = async () => {
    const response = await apiClient.post("addon/list", {});
    const { status, data } = await processAPIResponse(response, "event-add-on");
    if (status) {
      const optionsData = data.map((item: { name: string; id: string }) => ({
        label: item.name,
        value: item.id,
      }));
      setAddOnOptions(optionsData);
    }
  };

  useEffect(() => {
    handleAddOnOptionsApiCall();
  }, []);

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
      const addEndpoint = isAddon ? `/addon/add` : `/event/program/add`;

      if (isEditing && selectedProgramId) {
        // Define the success callback function
        const successCB = (response: any) => {
          // Update the programs state with the modified program data
          setPrograms((prevPrograms: { id: any }[]) =>
            prevPrograms.map((prog: { id: any }) =>
              prog.id === selectedProgramId ? { ...prog, ...programData } : prog
            )
          );
        };

        // Define the error callback function
        const errorCB = (error: any) => {
          Logger.error("Error updating program", error);
        };

        // Make the API call using the new POST function format
        POST({
          url: `event/update/${selectedProgramId}`,
          body: programData,
          id: "updateProgram",
          successCB,
          errorCB,
        });
      } else {
        // Define the success callback function for adding a new program/addon
        const successCB = (response: any) => {
          if (isAddon) {
            setAddons((prevAddons) => [...prevAddons, response.data]);
          } else {
            setPrograms((prevPrograms) => [...prevPrograms, response.data]);
          }
          Logger.error("Creation successful:", response.data);
        };

        // Define the error callback function for adding
        const errorCB = (error: any) => {
          Logger.error("Error adding program/addon", error);
        };
        POST({
          url: addEndpoint,
          body: programData,
          id: "addProgramOrAddon",
          successCB,
          errorCB,
        });
      }
    } catch (error) {
      Logger.error("Error updating data:", error);
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
          label=" + Add"
          onClick={handleAddClick}
        />
      </Grid>

      {/* Show invalid date items first */}
      {groupedData.invalid && (
        <Grid size={{ xs: 12 }} key="invalid">
          <Grid container spacing={2} className="event-sessions-session-list">
            {groupedData.invalid.map(
              (item: unknown, index: Key | null | undefined) => (
                <SessionCard
                  key={index}
                  item={item}
                  onEditClick={handleEditClick}
                  titleField="name"
                  startTimeField="startTime"
                  endTimeField="endTime"
                  fields={[
                    { label: "Description", field: "description" },
                    {
                      label: "Price",
                      field: "amount",
                      format: (value) => (value > 0 ? `$${value}` : "Free"),
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
                        format: (value) => (value > 0 ? `$${value}` : "Free"),
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
            setShowPriceField={setShowPriceField}
            setEditorContent={setEditorContent}
            onSubmit={onSubmit}
            closeDrawer={closeDrawer}
            addOnOptions={addOnOptions}
          />
        }
      />
    </Grid>
  );
};

export default Sessions;
