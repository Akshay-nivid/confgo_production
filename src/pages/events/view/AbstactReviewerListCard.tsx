/**
 * AbstractListCard Component
 * This component displays a list of user-submitted abstracts in a DataGrid.
 * Includes functionality to  open a drawer to assign reviewers.
 */
import { useState, useEffect, useCallback } from "react";
import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import FilterModal from "@/components/CustomFilter/FilterModal";
import { NoUserList } from "@/assets/svg";
import { Button} from "@mui/material";
import useStore, { setDataById } from "@/Libs/store";


const AbstractReviewer = () => {
  const { id } = useParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [source, setSource] = useState<any>({});
  const adminCompanyId=useStore((state:any)=>state.compData?.['adminCompanyId']?.companyId);
  
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
      filters: {
        companyId: adminCompanyId,
        roleEnums: [
          "REVIEWER"
        ]
      },
    };
    setSource({
      method: "POST",
      data: req,
      url: `user/userRole/list`,
      listName: "userReviewerList",
    });
  }, [id]);

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
      name: item?.firstName,
      email: item?.email,
      phone: item?.phone,
    }));
  };
  /**
   * 
   * @param id 
   */
  const handleAssign = (id: any) => {
    setDataById("tabValue", { value: '10' });
    setDataById("abstarctId", { id: id });
  }

  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 160 },
    { type: "default", field: "name", headerName: "Name", width: 200 },
    { type: "default", field: "email", headerName: "email", width: 200 },
    { type: "default", field: "phone", headerName: "phone", width: 200 },
    {
      type: "default",
      field: "Action",
      headerName: "Action",
      width: 160,
      renderCell: (params: any) => (
        <Button
          onClick={() => handleAssign(params.row.id)}
        >Assign
        </Button>
      ),
    }

  ];

  return (
    <Grid container>
      <Grid size={{ xs: 12 }}>
        <DataGridList
          dataTransformer={transformData}
          source={source}
          title="User Abstract List"
          noRecordIcon={<NoUserList className="userdetail-noimage" />}
          hideFooterPagination={false}
          columns={columns}
          id="userAbstract-list-datagrids"
        />
      </Grid>
      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={() => { }}
      />
    </Grid>
  );
};

export default AbstractReviewer;
