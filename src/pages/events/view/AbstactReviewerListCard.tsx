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
import useStore, { setDataById ,setNonPersistedDataById} from "@/Libs/store";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import AddIcon from '@mui/icons-material/Add';
import CreateNewUsers from "@/pages/Admin-users/CreateUsers";


interface AbstractReviewerProps {
  drawerOpen?:boolean
  expanded?:any
}

const AbstractReviewer : React.FC<AbstractReviewerProps> = ({drawerOpen,expanded}) => {
  const { id } = useParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [source, setSource] = useState<any>({});
  const adminCompanyId=useStore((state:any)=>state.compData?.['adminCompanyId']?.companyId);

 /**
   * opens the usercreate drawer if there is no reviewers
   */
useEffect(()=>{
  drawerOpen && expanded =='panel2-header' ? handleUserDrawer() : null
},[expanded])


  /**
  * Opens the "Create user Drawer" by updating the non-persisted state.
  * This function sets `craeteUserDrawer` to `true`, triggering the drawer to open.
  */
  function handleUserDrawer() {
    setNonPersistedDataById('craeteUserDrawer', { value: true })
  };

  const CreateUserDrawer =  useStore(state => state.nonPersistedData?.['craeteUserDrawer']?.value) || false;

    /**
   * Fetches the initial abstract list when the component is mounted.
   */
  useEffect(() => {
    userAbstractList();

    }, [CreateUserDrawer]);
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
        statusId:1,
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
      action: <Button
              onClick={() => handleAssign(item.id)}
             >Assign
        </Button>
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
    { type: "default", field: "id", headerName: "ID", width: 200 },
    { type: "default", field: "name", headerName: "Name", width: 250 },
    { type: "default", field: "email", headerName: "email", width: 250 },
    { type: "default", field: "phone", headerName: "phone", width: 200 },
    {
      type: "custom",
      field: "action",
      headerName: "Action",
      width: 150,
    } 

  ];

  return (
    <Grid container>
      <Grid container size={{ xs: 12 }} className="volunteer-list-card" spacing={2} justifyContent="flex-end">
        <Grid container spacing={2}>
          <CustomButton
            className="custom-green-btn"
            onClick={handleUserDrawer}
            label="Create New Reviewer"
            startIcon={<AddIcon />}
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
          id="AbstractReviewer-list"
        />
      </Grid>
      <FilterModal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={() => { }}
      />

      
      <CustomDrawer open={CreateUserDrawer} type="right">
        <CreateNewUsers NoNavigation={true} defaultValue={6}/>
      </CustomDrawer>
    </Grid>
  );
};

export default AbstractReviewer;
