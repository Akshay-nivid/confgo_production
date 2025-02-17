/**
 * AbstractListCard Component
 * This component displays a list of user-submitted abstracts in a DataGrid.
 * Includes functionality to  open a drawer to assign reviewers.
 */
import { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid2";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useParams } from "react-router-dom";
import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import FilterModal from "@/components/CustomFilter/FilterModal";
import { NoUserList } from "@/assets/svg";
import AssignReviewerDrawer from "./AssignReviewerDrawer";
import AddIcon from '@mui/icons-material/Add';
import { Box,IconButton, Modal, Typography } from "@mui/material";
import DeleteIcon from "@/assets/svg/DeleteIcon.svg";
import { CloseOutlined } from "@mui/icons-material";
import { PUT, setDataById } from "@/Libs/store";
import useStore from "@/Libs/store";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { Logger } from "@/Utils/Logger";
import UnpublishIcon  from '@/assets/svg/unpublish.svg';

const AbstractListCard = () => {
  const { id } = useParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAbstractId, setselectedAbstractId] = useState<number[] | null>(null);
  const [source, setSource] = useState<any>({});
  const companyId = sessionStorage.getItem("companyId");
  const [isPopUp, setisPopUp] = useState(false);
  const [abstractData, setabstractData] = useState<any[]>([]); 
  const [selectedId,setSelectedId] =useState<number | null>(null)
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const ReviewerId = useStore((state:any)=>state?.compData?.["abstarctId"]?.id)

  /**
   * Fetches the initial abstract list when the component is mounted.
   */
  useEffect(() => {
    userAbstractList();
  }, []);

  /**
   * Fetch Abstract List
   * Fetches the list of abstracts submitted by users for a specific event.
   * Sets the API source for the DataGrid.
   * @function userAbstractList
   */
  const userAbstractList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      filters: { eventId: id },
    };
    setSource({
      method: "POST",
      data: req,
      url: `userAbstract/list`,
      listName: "userAbstractList",
    });
  }, [id]);

  /**
   * handles the preview of abstract to review
   */
  // const handleAbstractClick = (id: number) => {
  //   const href = `${baseURL}/asset/${id}`;
  //   window.open(href, '_blank');
  // };

  /**
   * previews the selected id to confirm
   */
  const handleassign = (abstractId: number|null) => {
  if(abstractId == null ||  (Array.isArray(abstractId) && abstractId.length === 0)){
    setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: "Please select at least one abstract to assign." })
  }
  else{
    setselectedAbstractId(Array.isArray(abstractId) ? abstractId : [abstractId]); // Ensure flat array.
    setisPopUp(true);
  }
  };

  /**
   * Opens the reviewer assignment drawer for the selected abstract.
   * @param {number} abstractId - The ID of the selected abstract.
   */
  const handleconfirm = () => {
    setisPopUp(false);
    if (ReviewerId !=null){
      assignReviewer(ReviewerId)
      setDataById("abstarctId", { id: null });    
    }
    else{
      setIsDrawerOpen(true);
    }
  };

 /**
  * Assigns the selected reviewer from AbstractReviewer to the selected abstract.
  * Displays a success or error message based on the API response.
  */
  const assignReviewer = async (reviewerId: number) => {
    if (!selectedAbstractId) return;
    try {
      const req = {
        abstracts:selectedAbstractId,
        reviewerId:reviewerId,
      };
      const response = await apiClient.post(`/userAbstract/assign`, req);
      const { status } = await processAPIResponse(response, "reviewer-assignment");
      if (status) {
        setselectedAbstractId(null);
        setSelectedId(null)
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "success",
          message: "Reviewer Assigned",
        });
       userAbstractList();
      }
      else {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: "Failed to assign reviewer",
        });
      }
    } catch (error) {
      Logger.error("Error assigning reviewer:", error);
    }
  };

  /**
   * Closes the reviewer assignment drawer and refreshes the abstract list.
   */
  const handleAssignSuccess = () => {
    setIsDrawerOpen(false);
    userAbstractList();
    setselectedAbstractId(null);
    setSelectedId(null) 
  };

  /**
   * function to remove a reviewer from an assigned abstract. 
   * @param e mouseEvent
   * @param id abstract id
   */
  const handleUnassign = async (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await PUT({
        url: `userAbstract/${id}`,
        body: {
          reviewerId: null
        },
        id: 'userAbstract-update',
        successCB: (_data: any) => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: "Reviewer Unassigned from abstract" });
          userAbstractList();
        },
        errorCB: (context: any) => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
        }
      });
    } catch (error) {
      Logger.error("Error in userAbsrtract unassign ", error)
    }

  }

  /**
   * Transforms the raw API response data into the format required by the DataGrid.
   * @function transformData
   * @param {any} data - The raw data from the API response.
   * @returns {Array} Transformed data for the DataGrid.
   */
  const transformData = (data: any) => {
    setabstractData(data)
    if (!data) return [];
    return data.map((item: any) => ({
      id: item?.id,
      name: item?.asset?.name,
      email: item?.userAbstract?.user?.email,
      createdOn: item?.createdOn,
      status:(item?.statusId === 4 && item?.reviewerId != null) ? 13 : item?.statusId === 1 ? 9
            : item?.statusId === 2 ? 10 
            : 3,
      reviewer: item?.reviewer?.firstName ? (item?.reviewer?.firstName) : ("Not Assigned"),
      userName: item?.user?.firstName,
      unassign: <CustomButton
        startIcon={<UnpublishIcon />}
        disabled={item?.statusId !== 4}
        onClick={(e) => { handleUnassign(e, item.id); }}
        className="view-abstract-unassign-btn"
        label={"Unassign"}
      />,
    }));
  };

  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 90 },
    { type: "default", field: "userName", headerName: "Uploaded By", width: 165 },
    { type: "custom", field: "name", headerName: "Abstract", width: 150},
    { type: "dateField", field: "createdOn", headerName: "Submitted On", width: 175 },
    { type: "status", field: "status", headerName: "Review Status", width: 175 },
    { type: "custom", field: "reviewer", headerName: "Reviewer", width: 150 },
    { type: "custom", field: "unassign", headerName: "", width: 150 },
  ];

  /**
   * handles the multi selection 
   */
  const handleSelectionChange = (newSelection: any) => {
    setSelectedId(newSelection)
    const selectedRowData = newSelection.map((selectedId: number) => {
      return abstractData.find((row: any) => row.id === selectedId);
    });
    setSelectedRows(selectedRowData);
  };

/**
 * handles the delete function
 */
  const handleDelete = (id: number) => {
    const updatedRows = selectedRows.filter((row: any) => row.id !== id);
    setSelectedRows(updatedRows);
    const ids = updatedRows.map((item: any) => item.id); 
    setselectedAbstractId(ids);
  };

  return (
    <Grid container>
      <Grid container size={{ xs: 12 }} className="user-list-card" spacing={2} justifyContent="flex-end">
        <Grid container spacing={2}>
          <CustomButton
            className="abstract-green-btn"
            label="Assign"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => handleassign(selectedId ? selectedId : null )}
          />  

          <CustomButton
            className="custom-list-filter-btn"
            onClick={() => setIsFilterModalOpen(true)}
            label="Filters"
            startIcon={<TuneRoundedIcon />}
            variant="contained"
            color="primary"
            size="large"
          />
        </Grid>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DataGridList
          dataTransformer={transformData}
          source={source}
          title="User Abstract List"
          noRecordIcon={<NoUserList className="userdetail-noimage" />}
          hideFooterPagination={false}
          columns={columns}
          id="userAbstract-list-datagrid"
          checkboxSelection={true}
          onRowSelectionModelChange={handleSelectionChange}
          isRowSelectable={(params:any) => !params.row.reviewer || params.row.reviewer === "Not Assigned"}
        />
      </Grid>

      <AssignReviewerDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        abstractId={selectedAbstractId}
        companyId={companyId}
        onSuccess={handleAssignSuccess}
      />

      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={() => { }}
      />

    <Modal open={isPopUp}>
      <>
      <Box className="abstract-modal-container">
        <Box className="abstract-modal">
          <Grid container justifyContent="flex-end">
            <IconButton onClick={()=>setisPopUp(false)}>
              <CloseOutlined />
            </IconButton>
          </Grid>
          <Typography variant="h6" mb={3} textAlign="center">
            Selected User Abstract List
          </Typography>

          <Grid container spacing={2} mb={2} ml={2}>
            <Grid size={{xs:12,md:3}}>
              <Typography variant="subtitle2">ID</Typography>
            </Grid>
            <Grid size={{xs:12,md:3}}>
              <Typography variant="subtitle2">Name</Typography>
            </Grid>
            <Grid size={{xs:12,md:3}}>
              <Typography variant="subtitle2">Abstract</Typography>
            </Grid>
            <Grid size={{xs:12,md:3}}>
              <Typography variant="subtitle2">Action</Typography>
            </Grid>
          </Grid>

          {selectedRows.map((item: any, index: number) => (
            <Grid container spacing={2} className="abstract-selected" key={index}>
              <Grid size={{xs:12,md:3}}>
                <Typography>{item.id}</Typography>
              </Grid>
              <Grid size={{xs:12,md:3}}>
                <Typography>{item.user?.firstName}</Typography>
              </Grid>
              <Grid size={{xs:12,md:3}}>
                <Typography>{item.asset?.name}</Typography>
              </Grid>
              <Grid size={{xs:12,md:3}}>
                <IconButton onClick={() => handleDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

            <Grid container justifyContent="flex-end" mt={3}>
              {selectedId !=null && (
                <CustomButton
                  label="Confirm"
                  className="abstract-green-btn"
                  onClick={handleconfirm}
                />
              )}
            </Grid>
        </Box>
        </Box>
      </>
    </Modal>
    </Grid>
  );
};

export default AbstractListCard;
