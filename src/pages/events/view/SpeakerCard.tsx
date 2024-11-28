import CustomButton from "@/components/CustomButton/CustomButton";
import { IconButton, Modal, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import CustomSelect from "@/components/CustomSelectBox/CustomSelect";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomTextField from "@/components/CustomTextfield/CustomTextField";
import { Logger } from "@/Utils/Logger";
import { useParams } from "react-router-dom";
import apiClient from "@/Libs/Https/API-client";
import FileListModal from "@/components/FileUpload/FileListModal";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CloseIcon from "@mui/icons-material/Close";
import { DeleteContributorIcon, EditContributorIcon } from "@/assets/svg";
import useStore from "@/Libs/store";
import AddIcon from "@mui/icons-material/Add";
import config from "../../../../config.json";
import CreateContributorType from "../CreateContributorType";

interface CustomFile {
  id: number;
  name: string;

}
interface ContributorType {
  value: number | string;
  label: string;
}
interface EventParticipant {
  id: number;
  eventId: number;
  programType: string;
  name: string;
  phone: string | null;
  email: string | null;
  bio: string | null;
  assetId: number;
  createdBy: number;
  createdOn: string;
  description: string | null;
  designation: string;
  endTime: string | null;
  language: string | null;
  mediaUrl: string | null;
  modifiedBy: number | null;
  modifiedOn: string;
  startTime: string | null;
  statusId: number;
  topic: string | null;
}

const SpeakerCard = (_eventData: any) => {
  const { id } = useParams<Record<string, string | undefined>>();
  const { handleSubmit, control, reset } = useForm<FormData>();
  const [addContributeView, setAddContributeView] = useState(false);
  const [contributorType, setContributorType] = useState<ContributorType[]>();
  const [fileRequired, setFileRequired] = useState(false);
  const [contributorList, setContributorList] = useState([]);
  const [editContributorValue, setEditConrtributorValue] =
    useState<EventParticipant | null>();
  const contributorFields =
    useStore((state: any) => state?.compData?.["contributorFields"]) ?? [];
  const setDataById = useStore((state: any) => state.setDataById);
  const clearDataById = useStore((state: any) => state?.clearDataById);
  const POST = useStore((state: any) => state.POST);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<CustomFile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const baseUrl = config.api.url;
	const [newTypeView, setNewTypeView] = useState(false);
  /**
   *function to handle close the modal
   */
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };
  /**
   *function to handle open Drawer Edit
   */
  const handleScreenViewChange = () => {
    setAddContributeView(true);
  };
  /**
   *function to handle open Drawer Create
   */
  const handleDrawerOpen = () => {
    if(_eventData?.eventData?.published){
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Event is Already Published !",
      });
    }else{
    setSelectedFile(null)
    reset();
    setAddContributeView(true);
    setEditConrtributorValue(null);
    clearDataById("contributorFields");
    }
  };

  /**
   * Handler for submitting the fetch new Types.This function is invoked after a new contributor type is created.
   */
  const onTypeCreateSubmitHandler = async () => {
    await fetchProgramTypes();
  };
  /**
   *useEffect to call Api when screen renders
   */
  useEffect(() => {
    fetchProgramTypes();
    fetchProgramList();
  }, []);

  /**
   *fetch contributor list
   */
  const fetchProgramList = async () => {
    try {
      const requestBody = {
        filters: {
          eventId: _eventData?.eventData?.id,
        },
      };
      await POST({
        url: "eventProgram/list",
        body: requestBody,
        id: "eventProgramList",
        successCB: (context: any) => {
          if (context?.success) {
            const groupedByDesignation = context.data.reduce(
              (acc: any, item: any) => {
                const designation = item.designation;
                if (!acc[designation]) {
                  acc[designation] = [];
                }
                acc[designation].push(item);
                return acc;
              },
              {}
            );
            setContributorList(groupedByDesignation);
          }
        },
        errorCB: (context: any) => {
          Logger.error("SpeakerCard.tsx", context?.message);
        },
      });
    } catch (error) {
      Logger.error("SpeakerCard.tsx", error);
    }
  };

  /**
   *fetch contributor type list
   */
  const fetchProgramTypes = async () => {
    try {
      await POST({
        url: "participant/type/list",
        body: {
          filters: {
            isContributor: 1,
          }
        },
        id: "contributorTypeList",
        successCB: (context: any) => {
          if (context?.success) {
            const options = context?.data?.map((element: any) => ({
              value: element.name,
              label: element.name,
            }));
            const updatedOptionsData = [...options, { label: "Other", value: "other" }];
            setContributorType(updatedOptionsData);

             // Reset the form field after updating options
          reset({
            contributorType: "" // Resets contributorType to an empty value
          });
          }
        },
        errorCB: (context: any) => {
          Logger.error("SpeakerCard.tsx", context?.message);
        },
      });
    } catch (error) {
      Logger.error("SpeakerCard.tsx", error);
    }
  };

  /**
   *function to handle clean file state
   */
  const handleFileDelete = () => {
    setSelectedFile(null);
  };

  type FormData = {
    contributorType: string;
    contributorName: string;
    contributorDescription: string;
  };

  /**
   *select field options
   */
  const selectOptions = [
    { value: "other", label: "Other" },
    { value: "guest", label: "Guest" },
  ];

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (selectedFile && !editContributorValue) {
      createContributor(data);
    } else if (editContributorValue && contributorFields) {
      editContributor(data);
    } else {
      setFileRequired(true);
    }
  };
  /**
   * Handles the form submission for creating a contributor.
   * @param data - FormData containing contributor details.
   */

  const createContributor = async (formData: FormData) => {
    try {
      const requestBody = {
        eventId: id,
        name: formData.contributorName,
        assetId: selectedFile?.id ?? "",
        designation: formData.contributorType,
        description: formData.contributorDescription,
        statusId: "1",
      };
      await POST({
        url: "eventProgram/create",
        body: requestBody,
        id: "createContributor",
        successCB: (context: any) => {
          if (context?.success) {
            fetchProgramList();
            setAddContributeView(false);
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "success",
              message: "Contributor Added Successfully",
            });
          }
        },
        errorCB: (context: any) => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: context?.message,
          });
        },
      });
    } catch (e) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Something Went Wrong",
      });
      Logger.error("SpeakerCard.tsx");
    }
  };
  /**
   * Deletes a contributor by their ID.
   * @param id - The unique identifier of the contributor to be deleted.
   */
  const deleteContributor = async (id: number) => {
    try {
      await POST({
        url: `eventProgram/delete/${id}`,
        body: {},
        id: "deleteContributor",
        successCB: (context: any) => {
          if (context?.success) {
            setDeleteModal(false);
            fetchProgramList();
            setAddContributeView(false);
            setDataById("snackBarInfo", {
              open: true,
              autoHideDuration: 2000,
              severity: "success",
              message: "Contributor Deleted Successfully",
            });
          }
        },
        errorCB: (context: any) => {
          setDeleteModal(false);
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: context?.message,
          });
        },
      });
    } catch (error) {
      Logger.error("SpeakerCard.tsx", error);
    }
  };
  /**
   * function handles  editContributor
   * @param formData
   */
  const editContributor = async (formData: FormData) => {
    try {
      const requestBody = {
        eventId: id,
        name: formData.contributorName,
        assetId: selectedFile?.id ?? contributorFields?.assetId,
        designation: formData.contributorType,
        description: formData.contributorDescription,
        statusId: "1",
      };
      const response = await apiClient.put(
        `eventProgram/${contributorFields?.id}`,
        requestBody
      );
      const { status } = processAPIResponse(response, "editContribution");
      if (status) {
        fetchProgramList();
        setAddContributeView(false);
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "success",
          message: "Contributor Edit Successfully",
        });
      }
    } catch (error) {
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Something Went Wrong",
      });
    }
  };

  /**
   * function handles edit contributor form fields
   * @param item
   */
  const handleContributorEdit = (item: EventParticipant) => {
    if(_eventData?.eventData?.published){
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Event is Already Published !",
      });
    }else{
    reset();
    setDataById("contributorFields", item);
    setEditConrtributorValue(item);

    if (item?.assetId) {
      setSelectedFile({
          id: item.assetId,
          name:item?.name,

      });
  }
    handleScreenViewChange();
    }
  };
  /**
   * function handles delete contributor form fields
   * @param item
   */
  const handleDeleteModal = (item: EventParticipant) => {
    if(_eventData?.eventData?.published){
      setDataById("snackBarInfo", {
        open: true,
        autoHideDuration: 2000,
        severity: "error",
        message: "Event is Already Published !",
      });
    }else{
    setDataById("contributorFields", item);
    setDeleteModal(true);
    }
  };
  /**
   * function to close the new type creation drawer
   */
  const handleDrawerClose = () => {
    setAddContributeView(true);
    setNewTypeView(false);
  };
  return (
    <Grid
      className="event-detail-speakers-card"
      container
      spacing={2}
      flexDirection={"column"}
    >
      <Grid container size={{ xs: 12, sm: 12 }}>
        <Grid
          className="event-detail-speakers-card-speaker-list"
          direction={"row"}
          display={"flex"}
          size={{ xs: 12, sm: 12 }}
        >
          <Grid direction={"column"} size={{ xs: 12, sm: 12 }}>
            <Grid
              container
              justifyContent={"space-between"}
              size={{ xs: 12, sm: 12 }}
            >
              <Grid>
                <Typography className="event-detail-speakers-card-speaker-header">
                  Event Contributors{" "}
                </Typography>
              </Grid>
              <Grid>
                <CustomButton
                  className="event-detail-speakers-card-speaker-add-button"
                  variant="outlined"
                  label="Add"
                  onClick={handleDrawerOpen}
                  startIcon={<AddIcon />}
                />
              </Grid>
            </Grid>
            <Grid container mt={2}></Grid>
            <Typography
              variant="h6"
              className="event-detail-speakers-card-speaker-content"
            >
              Event Contributors allows you to easily add and manage key
              participants in your event, such as speakers, sponsors
            </Typography>
            <Typography
              variant="h6"
              className="event-detail-speakers-card-speaker-content"
            >
              guests, and other contributors. Keep track of all the important
              roles to ensure a smooth and successful event experience.
            </Typography>
          </Grid>
        </Grid>
        {/* Contributor List */}
        <Grid
          className="event-detail-speakers-card-list-row"
          container
          justifyContent={"center"}
          alignContent={"center"}
        >
          {contributorList &&
            Object.values(contributorList)?.map((item: any) => {
              return (
                <Grid
                  size={{ xs: 12 }}
                  container
                  flexDirection={"column"}
                  direction={"column"}
                >
                  <Grid>
                    {" "}
                    <Typography className="event-detail-speakers-card-list-row-header">
                      {item[0]?.designation}
                    </Typography>
                  </Grid>
                  <Grid container flexDirection={"row"} direction={"row"}>
                    {item?.map((item: any) => {
                      return (
                        <Grid>
                          <Grid
                            container
                            className="event-detail-speakers-card-list-row-container"
                            key={item?.id}
                            alignItems={"flex-start"}
                            spacing={0.5}
                          >
                            <Grid>
                              <img
                                className="event-detail-speakers-card-list-row-img"
                                src={`${baseUrl}asset/${item?.assetId}`}
                                alt={item?.name}
                              />
                              <Typography className="event-detail-speakers-card-list-row-name">
                                {item?.name}
                              </Typography>
                              <Grid
                                display={"flex"}
                                className="event-detail-speakers-card-list-row-box"
                              >
                                <Grid
                                  onClick={() => handleContributorEdit(item)}
                                >
                                  <EditContributorIcon className="event-detail-speakers-card-list-row-box-icon" />
                                </Grid>
                                <Grid onClick={() => handleDeleteModal(item)}>
                                  <DeleteContributorIcon className="event-detail-speakers-card-list-row-box-icon" />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
        {/* Drawer */}
        <CustomDrawer
          type="right"
          open={addContributeView}
          children={
            <Grid className="event-detail-speakers-card-drawer-box">
              <Grid container justifyContent={"space-between"} mb={1}>
                <Typography className="event-detail-speakers-card-contributor-header">
                  {editContributorValue != null
                    ? "Edit Event Contributor"
                    : "Create New Event Contributor"}
                </Typography>
                <IconButton onClick={() => setAddContributeView(false)}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={4}>
                    <Grid container size={{ xs: 12 }}>
                      <CustomSelect
                        name="contributorType"
                        label="Contributor Type"
                        options={contributorType ?? selectOptions}
                        optionClick={(value) => {
                          if (value === "other") {
                            setNewTypeView(true);
                            setAddContributeView(false);
                          }
                        }}
                        control={control}
                        rules={{ required: true }}
                        defaultValue={contributorFields?.designation}
                        fullWidth
                      />
                    </Grid>
                    <Grid container size={{ xs: 12 }} spacing={4}>
                      <Grid size={{ xs: 12 }}>
                        <CustomTextField
                          defaultValue={contributorFields?.name}
                          rules={{ required: true }}
                          control={control}
                          placeholder="Contributor name"
                          name="contributorName"
                          label="Contributor name"
                          requiredField={true}
                        />
                      </Grid>
                      <Grid container size={{ xs: 12 }}>
                        <CustomTextField
                          defaultValue={contributorFields?.description ?? ""}
                          rules={{ required: true }}
                          rows={4}
                          multiline={true}
                          placeholder="Contributor Description"
                          control={control}
                          name="contributorDescription"
                          label="Contributor Description"
                          requiredField={true}
                        />
                      </Grid>
                    </Grid>

                    <Grid></Grid>
                  </Grid>
                  {/* Image Picker */}
                  <Grid
                    className="event-detail-speakers-card-btn-container"
                    container
                    justifyContent={"flex-end"}
                    flexDirection={"row"}
                    mr={2}
                  >
                    <CustomButton
                      className="event-detail-speakers-card-btn-container-photo-btn"
                      label="Select Photo"
                      variant="outlined"
                      onClick={() => setModalOpen(true)}
                    />
                    <Grid>
                      {fileRequired && (
                        <Typography className="event-detail-speakers-card-btn-container-photo-txt">
                          Please Select an Image
                        </Typography>
                      )}
                      {modalOpen && (
                        <FileListModal
                          open={modalOpen}
                          handleClose={() => setModalOpen(false)}
                          onSelectFile={(files: CustomFile[]) => {
                            // Automatically select the newly uploaded file if it exists
                            if (files && files.length > 0) {
                              setSelectedFile(files[0]); // Set only the first selected file
                            }
                            setFileRequired(false);
                            setModalOpen(false);
                          }}
                          companyId={_eventData.companyId}
                          multipleSelect={false}
                          imagesPerRow={4}
                        />
                      )}
                    </Grid>
                    <CustomButton
                      className="event-detail-speakers-card-btn-container-submit-btn"
                      label="Submit"
                      variant="contained"
                      type="submit"
                    />
                  </Grid>
                  {selectedFile && (
                    <Grid justifyContent={"center"} alignItems={"center"}>
                      <img
                        src={`${baseUrl}asset/${selectedFile.id}`}
                        alt={selectedFile.name}
                        className="event-detail-speakers-card-btn-container-selected-img"
                      />
                      <Grid>
                        <Typography variant="body2">
                          {selectedFile.name}
                        </Typography>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={handleFileDelete}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )}
                </form>
              </Grid>
            </Grid>
          }
        />
      </Grid>
      {/*Contributor Delete Modal */}
      <Modal open={deleteModal} onClose={handleCloseDeleteModal}>
        <Grid
          className="event-detail-speakers-card-delete-modal"
          container
          justifyContent={"center"}
          alignContent={"center"}
          flexDirection={"column"}
          alignItems={"center"}
          spacing={2}
        >
          <Typography variant="h6" component="h2">
            {"Do you Want to Delete ?"}
          </Typography>
          <Grid
            size={{ xs: 6 }}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <CustomButton
              className="event-detail-speakers-card-delete-modal-btn-ok"
              variant="contained"
              onClick={() => deleteContributor(contributorFields?.id)}
              label="Ok"
            />
            <CustomButton
              className="event-detail-speakers-card-delete-modal-btn-cancel"
              variant="outlined"
              onClick={() => setDeleteModal(false)}
              label="Cancel"
            />
          </Grid>
        </Grid>
      </Modal>
      <CustomDrawer
        children={<CreateContributorType submitHandler={onTypeCreateSubmitHandler} closeDrawer={handleDrawerClose} />}
        open={newTypeView}
        type="right"
        onClose={() => handleDrawerClose}
      />
    </Grid>
  );
};
export default SpeakerCard;
