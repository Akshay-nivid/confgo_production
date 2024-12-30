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

const AbstractListCard = () => {
  const { id } = useParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAbstractId, setSelectedAbstractId] = useState<number | null>(null);
  const [source, setSource] = useState<any>({});
  const companyId = sessionStorage.getItem("companyId");

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
   * Opens the reviewer assignment drawer for the selected abstract.
   * @param {number} abstractId - The ID of the selected abstract.
   */
  const handleRowClick = (abstractId: number) => {
    setSelectedAbstractId(abstractId);
    setIsDrawerOpen(true);
  };

  /**
   * Closes the reviewer assignment drawer and refreshes the abstract list.
   */
  const handleAssignSuccess = () => {
    setIsDrawerOpen(false);
    userAbstractList();
  };

  /**
   * Transforms the raw API response data into the format required by the DataGrid.
   * @function transformData
   * @param {any} data - The raw data from the API response.
   * @returns {Array} Transformed data for the DataGrid.
   */
  const transformData = (data: any) => {
    if (!data) return [];
    return data.map((item: any) => ({
      id: item?.id,
      name: item?.asset?.name,
      email: item?.userAbstract?.user?.email,
      createdOn: item?.createdOn,
      status: item?.statusId === 1 ? 9
            : item?.statusId === 2 ? 10 
            : 3,
      reviewer: item?.reviewer?.firstName ? (item?.reviewer?.firstName) : ("Not Assigned"),
      userName: item?.user?.firstName,
    }));
  };

  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 150 },
    { type: "default", field: "userName", headerName: "Uploaded By", width: 200 },
    { type: "dateField", field: "createdOn", headerName: "Submitted On", width: 200 },
    { type: "default", field: "name", headerName: "Abstract File", width: 200 },
    { type: "default", field: "reviewer", headerName: "Reviewer", width: 180 },
    { type: "status", field: "status", headerName: "Review Status", width: 175 },
  ];

  return (
    <Grid container>
      <Grid container size={{ xs: 12 }} className="user-list-card" spacing={2} justifyContent="flex-end">
        <Grid container spacing={2}>
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
          onRowClick={(params: any) => handleRowClick(params.id)}
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
    </Grid>
  );
};

export default AbstractListCard;
