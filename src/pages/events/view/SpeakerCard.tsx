import CustomButton from "@/components/CustomButton/CustomButton";
import { Avatar, IconButton, Modal, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Logger } from "@/Utils/Logger";
import { useParams } from "react-router-dom";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CloseIcon from "@mui/icons-material/Close";
import {NoCouponDataSvg } from "@/assets/svg";
import useStore from "@/Libs/store";
import AddIcon from "@mui/icons-material/Add";
import config from "../../../../config.json";
import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import { ISource } from "@/Libs/type";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import DeleteIcon from "@/assets/svg/DeleteIcon.svg";

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

type TransformedData = {
  id: number;
  name: string;
};

const SpeakerCard = (_eventData: any) => {
  const { id } = useParams<Record<string, string | undefined>>();
  const { handleSubmit, control, reset,watch, formState: { errors }, setValue } = useForm<FormData>();
  const [addContributeView, setAddContributeView] = useState(false);
  const [editContributorValue, setEditConrtributorValue] =
    useState<EventParticipant | null>();
  const contributorFields = useStore((state: any) => state?.compData?.["contributorFields"]) ?? [];    
  const setDataById = useStore((state: any) => state.setDataById);
  const clearDataById = useStore((state: any) => state?.clearDataById);
  const POST = useStore((state: any) => state.POST);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const baseUrl = config.api.url;
  const [searchResults, setSearchResults] = useState<TransformedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [handleSelectedValue,setHandleSelectedValue]=useState<any>();
  const companyId = sessionStorage.getItem("companyId")
   const [source, setSource] = useState<ISource | undefined>(undefined);
  /**
   * Method transforms data to the autocomplete data format
   * @param data : api response data
   * @returns 
   */
  function transformUserData(data: any): TransformedData[] {
    return data?.map((item: any) => ({
      id: item?.id,
      name: `${item?.firstName} ${item?.lastName} (${item?.email})`,
      fullName: `${item?.firstName} ${item?.lastName}`,
      ...item
    }));
  }
//    /**
//      * Method handles the document download functionality
//      * @param id : document id
//      */
//    const handleDownload = (id: any) => {
//     const href = `${baseUrl}asset/${id}`
//     window.open(href, '_blank')
// };
  /**
   *function to handle close the modal
   */
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };
  /**
   *function to handle open Drawer Edit
   */
  // const handleScreenViewChange = () => {
  //   setAddContributeView(true);
  // };
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
    reset({
      contributorName: "",
      contributorType: "",
      contributorDescription:"",
      userInfo: ""
    });
    setAddContributeView(true);
    setEditConrtributorValue(null);
    clearDataById("contributorFields");
    }
  };


  /**
   *useEffect to call Api when screen renders
   */
  useEffect(() => {
    fetchProgramList();
  }, []);

  /**
   *fetch contributor list
   */
  const fetchProgramList = async () => {
    try {
      const requestBody = {
        offset: 0,
        limit: 5,
        filters: {
          eventId: _eventData?.eventData?.eventData?.id,
        },
      };
      setSource({
         method:"POST",
         data:requestBody,
         url: "eventSpeaker/list",
         listName: "speakerList",
        

      });
      return;
    }
    catch (error) {
      Logger.error("SpeakerCard.tsx", error);
    }
  };
  type FormData = {
    contributorType: string;
    contributorName: string;
    contributorDescription: string;
    userInfo: any;
  };


  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (!editContributorValue) {
      createContributor(data);
    } else if (editContributorValue && contributorFields) {
      editContributor(data);
    } else {
    }
  };
  /**
   * Handles the form submission for creating a contributor.
   * @param data - FormData containing contributor details.
   */

  const createContributor = async (formData: FormData) => {
    try {
      const requestBody = {
        userId: formData.userInfo?.id,
        eventId: id,
        statusId: "1",
      };
      await POST({
        url: "eventSpeaker/create",
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
        errorCB: () => {
          setDataById("snackBarInfo", {
            open: true,
            autoHideDuration: 2000,
            severity: "error",
            message: "This speaker is already assigned to the event.",
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
        url: `eventSpeaker/delete/${id}`,
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
        userId: formData.userInfo?.id,
        statusId: "1",
      };
      const response = await apiClient.put(
        `eventSpeaker/${contributorFields?.id}`,
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
    setDataById("contributorFields", {id:item});
    setDeleteModal(true);
    }
  };
   /**
    *  Function to handle search API for autocomplete
    */ 
   const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const req = {
        filters: {
          roleEnums: ['SPEAKER'],
          name: query,
          companyId: companyId,
        },
      };
      const response = await apiClient.post(`user/userRole/list`, req);
      const { status, data } = processAPIResponse(response, "userRoleList");
      if (status) {
        setSearchResults(transformUserData(data));
      }
      // Update the options based on API response
    } catch (error) {
      Logger.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

   /**
    * Method handles the selection of the user
    * @param selected : userId
    */
  const handleUserSelection = (selected: any) => {
      selected&&setHandleSelectedValue(selected);
      selected && setValue('contributorName',selected?.fullName)
  };

   // Column configuration for the DataGrid component
   const columns = [
    { type: "default", field: "id", headerName: "ID", width: 150 },
    { type: "default", field: "name", headerName: "Name", width: 200 },
    {
      type: "default",
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      type: "default",
      field: "phone",
      headerName: "Phone No",
      width: 200,
    },
    {
      type: "status",
      field: "status",
      headerName: "Status",
      width: 150,
    },
    
    {
      type:"default",
      field:"Action",
      headerName: "Action",
      width:100,
      renderCell: (params: any) => (
        <IconButton
          onClick={() => handleDeleteModal(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    }
  ];
  /**
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  const transformData = (data: any) => {
    if (!data) return [];
    return data.map((item: any) => {
      return {
        ...item,
        id: item?.id,
        name: `${item?.user?.firstName} ${item?.user?.lastName}`,
        email: item?.user?.email,
        phone: item?.user?.phone,
        status: item?.statusId,
        Action: <DeleteIcon onClick={()=>handleDeleteModal(item?.user?.id)} />
      };
    });
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
                  Speakers
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
              Speakers allows you to easily add and manage key
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
        <Grid
          className="event-detail-speakers-card-list-row"
          container
          justifyContent={"center"}
          alignContent={"center"}
        >
        <Grid size={{ xs: 12 }}>
        <DataGridList
           dataTransformer={transformData}
          source={source}
          title="Volunteers"
          hideFooterPagination={false}
          columns={columns}
          id="speaker-lists"
          noRecordIcon={<NoCouponDataSvg className="no-coupon-icon"/>}
          noRecordSubtitle="cIt looks like you haven't created any volunteer yet."
        />
      </Grid>
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
                    ? "Edit Contributor"
                    : "Create Contributor"}
                </Typography>
                <IconButton onClick={() => setAddContributeView(false)}>
                  <CloseIcon />
                </IconButton>
              </Grid>
              <Grid>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid container size={{ xs: 12 }} pt={2}>
                      <CustomAutocomplete
                        name="userInfo"
                        className={errors['userInfo'] ?"custom-search-text-field event-detail-speakers-card-contributor-auto-complete border-error-input": "custom-search-text-field event-detail-speakers-card-contributor-auto-complete"}
                        control={control}
                        placeholder="Search Contributor User"
                        options={searchResults} // Dynamic options based on API results
                        getOptionLabel={(option: any) => option.name || ''} // Adjust based on your data structure
                        onSearch={handleSearch} // Call the search function
                        loading={loading}
                        rules={{ required: true }}
                        onChange={handleUserSelection}
                      />
                    </Grid>
                   {handleSelectedValue && watch('contributorName')&& < >
                    <Grid size={{xs:12,sm:6}}>
                    <Typography className="event-detail-speakers-card-speaker-content">Name</Typography>
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                    <Typography className="event-detail-speakers-card-speaker-content">{handleSelectedValue?.firstName}{" "}{handleSelectedValue?.lastName}</Typography>
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                    <Typography className="event-detail-speakers-card-speaker-content">Email</Typography>
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                    <Typography className="event-detail-speakers-card-speaker-content">{handleSelectedValue?.email}</Typography>
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                    <Typography className="event-detail-speakers-card-speaker-content">Phone</Typography>
                    </Grid>
                    <Grid size={{xs:12,sm:6}}>
                    <Typography className="event-detail-speakers-card-speaker-content">{handleSelectedValue?.phone}</Typography>
                    </Grid>
                    </>}
                  </Grid>
                  <Grid container justifyContent="flex-end" alignItems="center" size={12}>
                    <CustomButton
                      className="event-detail-speakers-card-btn-container-submit-btn"
                      label="Submit"
                      variant="contained"
                      type="submit"
                    />
                  </Grid>   
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
    </Grid>
  );
};
export default SpeakerCard;
