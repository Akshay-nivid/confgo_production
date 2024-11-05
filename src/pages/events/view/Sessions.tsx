import { Typography, IconButton, Box } from "@mui/material";
import Grid from '@mui/material/Grid2'; 
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { useForm } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import CustomButton from "@/components/CustomButton/CustomButton";
import { CloseOutlined } from "@mui/icons-material";
import CustomRadio from "@/components/CustomRadio/CustomRadio";
import apiClient from "@/Libs/Https/API-client";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { ISource } from "@/Libs/type";
/**
 * To display the session.
 */
const Sessions = ({ eventData }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPriceField, setShowPriceField] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null); // Track the ID of the program being edited
  const parentId = eventData.id;
  const [programs, setPrograms] = useState(eventData.programs || []);
  const [addons, setAddons] = useState(eventData.addons || []);
  const [isAddon, setIsAddon] = useState(false);
  const [addOnOptions, setAddOnOptions] = useState<any>();




  const [selectedProgram, setSelectedProgram] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    speaker: "",
    programType: "",
    isPaid: "Free",
    amount: "",
  });

  const { control, handleSubmit, setValue, watch } = useForm();
  const closeDrawer = () => setDrawerOpen(false);

  // Merge programs and addons into one list
  const combinedItems = [
    ...programs.map((item) => ({ ...item, type: "program" })),
    ...addons.map((item) => ({ ...item, type: "addon" })),
  ];

  const typeArray = [
    { label: "Paid", value: "PAID" },
    { label: "Free", value: "FREE" },
  ];



  const groupedData = combinedItems.reduce(
    (acc, program) => {
      const date = moment(program.startTime).isValid()
        ? moment(program.startTime).format("YYYY-MM-DD")
        : "Invalid Date";
  
      if (date === "Invalid Date") {
        // Add to 'invalid' group
        if (!acc.invalid) acc.invalid = [];
        acc.invalid.push(program);
      } else {
        // Add to valid groups by date
        if (!acc[date]) acc[date] = [];
        acc[date].push(program);
      }
  
      return acc;
    },
    {}
  );
  

  const handleEditClick = (program) => {
    const isPaid =
      program.amount && parseFloat(program.amount) > 0 ? "PAID" : "FREE";
    const id = program.id;
    setIsAddon(program.type === "addon");
    setSelectedProgram({
      ...program,
      isPaid,
      amount: program.amount || 0,
    });
    setSelectedProgramId(id);
    setShowPriceField(isPaid === "PAID");
    setIsEditing(true);
    setDrawerOpen(true);
  };

  const handleAddClick = () => {
    setSelectedProgram({
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      speaker: "",
      location: "",
      isPaid: "Free",
      amount: "",
    });
    setShowPriceField(false);
    setIsEditing(false);
    setIsAddon(false);
    //onreset();  // Resets form fields
    setDrawerOpen(true);
  };

  /**
   * Useeffect hook handles the api call for getting event status and add options
   */
  useEffect(() => {
    handleAddOnOptionsApiCall();
  }, []);

  /**
   * Method handles the api call for getting add on options
   */
  const handleAddOnOptionsApiCall = async () => {
    const response = await apiClient.post("addon/list", {});
    const { status, data } = await processAPIResponse(response, "event-add-on");
    if (status) {
      const optionsData = data?.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      setAddOnOptions(optionsData);
    }
  };

  // Use useEffect to update form fields when selectedProgram changes
  useEffect(() => {
    if (selectedProgram) {
      setValue("name", selectedProgram.name);
      setValue("description", selectedProgram.description);
      setValue(
        "startTime",
        moment(selectedProgram.startTime).format("YYYY-MM-DDTHH:mm")
      );
      setValue(
        "endTime",
        moment(selectedProgram.endTime).format("YYYY-MM-DDTHH:mm")
      );
      setValue("speaker", selectedProgram.speaker);
      setValue("isPaid", selectedProgram.isPaid);
      setValue("price", selectedProgram.amount);
    }
  }, [selectedProgram, setValue]);

  // Watch for changes in "isPaid" to update the visibility of the price field
  const isPaid = watch("isPaid");
  useEffect(() => {
    setShowPriceField(isPaid === "PAID");
    if (isPaid === "FREE") {
      setValue("price", 0); // Clear the price field if "Free" is selected
    }
  }, [isPaid, setValue]);

  const onSubmit = async (data) => {
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
      const endpoint = isAddon
        ? `/addon/update/${selectedProgramId}`
        : `/event/update/${selectedProgramId}`;
      const addEndpoint = isAddon ? `/addon/add` : `/event/program/add`;

      if (isEditing && selectedProgramId) {
        // Update program API call
        await apiClient.post(`/event/update/${selectedProgramId}`, programData);
        setPrograms((prevPrograms) =>
          prevPrograms.map((prog) =>
            prog.id === selectedProgramId ? { ...prog, ...programData } : prog
          )
        );
      } else {
        const response = await apiClient.post(addEndpoint, programData);
        if (isAddon) {
          setAddons((prevAddons) => [...prevAddons, response.data]);
        } else {
          setPrograms((prevPrograms) => [...prevPrograms, response.data]);
        }
        console.log("Creation successful:", response.data);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <Grid container spacing={3} className="event-sessions-sessions-container">
      <Grid
        size={{xs:12}}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography className="event-detail-sessions-card-header">Event Sessions</Typography>
        <CustomButton className="event-detail-speakers-card-speaker-add-button" variant="outlined" label=" + Add" onClick={handleAddClick} />
      </Grid>

      {/* Show invalid date items first */}
    {groupedData.invalid && (
      <Grid size={{xs: 12}}  key="invalid">
        

        <Grid container spacing={2} className="event-sessions-session-list">
          {groupedData.invalid.map((item, index) => (
            <Grid size={{xs:12, sm:6, md:4}} key={index} className="event-sessions-session-card">
              {/* Session card contents */}
              <div className="event-sessions-session-card-header">
                <div className="event-sessions-session-card-time">
                  
                </div>
                <IconButton
                  size="small"
                  className="edit-button"
                  onClick={() => handleEditClick(item)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </div>
              <div className="event-sessions-session-card-details">
                <Typography variant="h6" className="event-sessions-session-card-title">
                  {item.type === "program"
                    ? ` ${item.name}`
                    : ` ${item.addon?.name}`}
                </Typography>
                <Typography className="event-sessions-session-card-speaker">
                  {item.type === "program"
                    ? `Program Description: ${item.description}`
                    : ``}
                </Typography>
                <Typography className="event-sessions-session-card-speaker">
                  Price: {item.amount}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    )}

    {/* Render valid date items */}
    {Object.keys(groupedData)
      .filter((date) => date !== "invalid")
      .map((date) => (
        <Grid size={{xs: 12}} key={date}>
          <Box className="event-sessions-date-header" display="flex" alignItems="center">
            <DateRangeIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {moment(date).format("MMMM D YYYY")}
            </Typography>
          </Box>

          <Grid container spacing={2} className="event-sessions-session-list">
            {groupedData[date].map((item, index) => (
              <Grid
                size = {{xs:12, sm:6, md:4}}
                key={index}
                className="event-sessions-session-card"
              >
                <div className="event-sessions-session-card-header">
                  <div className="event-sessions-session-card-time">
                    <Typography variant="subtitle2">
                      {moment(item.startTime).format("h:mm A")} -{" "}
                      {moment(item.endTime).format("h:mm A")}
                    </Typography>
                  </div>
                  <IconButton
                    size="small"
                    className="event-detail-event-info-card-edit-btn"
                    onClick={() => handleEditClick(item)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </div>

                <div className="session-details">
                  <Typography variant="h6" className="event-detail-sessions-card-header">
                    {item.type === "program"
                      ? ` ${item.name}`
                      : ` ${item.addon?.name}`}
                  </Typography>
                  <Typography className="event-sessions-session-card-speaker">
                    {item.type === "program"
                      ? `Program Description: ${item.description}`
                      : ``}
                  </Typography>
                  <Typography className="event-sessions-session-card-speaker">
                    Price: {item.amount}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
      <CustomDrawer open={drawerOpen} type="right">
        <Grid container spacing={2} padding={2}>
          <Grid
            size = {{xs:12}}
            container
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3" className="create-event-description">
              {isEditing
                ? isAddon
                  ? "Edit Addon"
                  : "Edit Program"
                : isAddon
                ? "Add Addon"
                : "Add Program"}
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Grid size={{xs: 12}}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} direction="column">
                {isAddon ? (
                  <Grid size={{xs: 12}} >
                    <CustomSelect
                      name="addonType"
                      label="Select Addon Type"
                      options={addOnOptions} // Add your addon options array here
                      control={control}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid size={{xs:12}}>
                      <CustomTextField
                        name="name"
                        placeholder="Program Name"
                        control={control}
                        requiredField
                      />
                    </Grid>

                    <Grid size={{xs:12}}>
                      <CustomTextField
                        name="description"
                        multiline
                        rows={6}
                        placeholder="Program Description"
                        control={control}
                      />
                    </Grid>
                  </>
                )}
                <Grid size={{xs:12}}>
                  <CustomTextField
                    placeholder="Start Date & Time"
                    control={control}
                    name="startTime"
                    type="datetime-local"
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <CustomTextField
                    placeholder="End Date & Time"
                    control={control}
                    name="endTime"
                    type="datetime-local"
                  />
                </Grid>

                <Grid size={{xs:12}}>
                  <CustomRadio
                    control={control}
                    name="isPaid"
                    label=""
                    options={typeArray}
                    row
                  />
                </Grid>
                {showPriceField && (
                  <Grid size={{xs:12}}>
                    <CustomTextField
                      placeholder="Price"
                      control={control}
                      name="price"
                      type="text"
                    />
                  </Grid>
                )}
                <Grid size={{xs:12}}>
                  <Grid container justifyContent="right">
                    <CustomButton
                      label="Submit"
                      className="event-sessions-edit-button"
                      type="submit"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </CustomDrawer>
    </Grid>
  );
};

export default Sessions;
