import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import CustomButton from "@/components/CustomButton/CustomButton";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import apiClient from "@/Libs/Https/API-client";
import { ISource } from "@/Libs/types/type";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { Logger } from "@/Utils/Logger";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { Filter } from "@/components/Filter";
import useStore, { setDataById, setNonPersistedDataById } from "@/Libs/store";
import { NoUserList } from "@/assets/svg";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CreateNewUsers from "./CreateUsers";

interface Role{
  value:string,
  name:string
}
type RoleList = {
  id: number;            
  roleName: string;     
  description: string;   
  createdBy: string | null; 
  createdOn: string;     
  modifiedBy: string | null; 
  modifiedOn: string;    
};
/**
 * componet for showing full Admin created Company User List
 */
const AdminUsersList=()=>{
    const [searchResults, setSearchResults] = useState([]);
    const [source, setSource] = useState<ISource | undefined>(undefined);
    const [loading, setLoading] = useState(false); // To indicate loading state for API
    const POST = useStore((state: any) => state.POST);
    const { control } = useForm();
    const [roleList,setRoleList]=useState<Role []>([])

  /**
   * Fetches the userRole list when the component mounts.
   */
  useEffect(() => {
    UserRoleList();
    getRoleList();
  }, []);

  /**
   * Function to set the initial request configuration for fetching participant data.
   */
  const UserRoleList = useCallback(() => {
    const companyId=sessionStorage.getItem('companyId')
    const req = {
      offset: 0,
      limit: 5,
    filters:{
      companyId:companyId,
      roleEnums: [
        "VOLUNTEER",
        "SPEAKER",
        "REVIEWER"
    ]
    }
    };

    setSource({
      method: "POST",
      data: req,
      url: `user/userRole/list`,
      listName: "UserRoleList",
    });
    return;
  }, []);

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
        name: item?.firstName, 
        role:item?.userRoles[0]?.role?.roleName,
        email:item?.email,
        phone:item?.phone,
        status:item?.user?.statusId
      };
    });
  };
  /**
   * fetching full role list 
   */
  const getRoleList=async ()=>{
    await POST({
        url:'role/list',
        body:{
                "offset": 0,
                "limit": 100,
                "sortBy": "id",
                "sortDirection": "DESC",
        },
        id:'user-role-list',
        successCB: (context: any) => {
            let roleData: Role[] = []; 
            context.data.forEach((item: RoleList) => {
                if (![1,2,3].includes(item.id)) {
                    roleData.push({
                        value: item.roleName,
                        name: item.roleName
                    });
                }
            });
            setRoleList(roleData);
        }, 
        errorCB: (context: any) => {
            setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
        }
    });
}


  /**
   * Updates the source for the data grid when an autocomplete selection is made.
   * @param selected - The selected item from the autocomplete list
   */
  const handleAutocompleteChange = (selected: any) => {
    const companyId=sessionStorage.getItem('companyId')
    if (selected) {
      setSource({
        method: "POST",
        data: {
          offset: 0,
          limit: 5,
          filters: {
            userId: selected.id,
            companyId:companyId,
            roleEnums: [
              "VOLUNTEER",
              "SPONSER",
              "SPEAKER",
              "REVIEWER",
          ]
          },
        },
        url: `user/userRole/list`,
        listName: "newRole-1",
      });
    }
  };

// const handleRowClick=(id:string |number)=>{
//   navigate(routes.userdetail(id))
// }
  /**
   * Searches users based on the query entered by the user.
   * @param query - The search query entered by the user
   */
  const handleSearch = async (query: string) => {
    const companyId=sessionStorage.getItem('companyId')
    setLoading(true);
    try {
      let req = {
        filters: {
          name: query,
          companyId:companyId,
          roleEnums: [
            "VOLUNTEER",
            "SPONSER",
            "SPEAKER",
            "REVIEWER",
          ]
        },
      };
      const response = await await apiClient.post(
        `user/userRole/list`,
        req
      );
      const { status, data } = await processAPIResponse(
        response,
        "UserRoleListSearch"
      );
      if (status) {
        setSearchResults(data);
      }
    } catch (error) {
      Logger.error("UserListCard.tsx", error);
    } finally {
      setLoading(false);
    }
  };

  // Column configuration for the DataGrid component
  const columns = [
    { type: "default", field: "id", headerName: "ID", width: 150 },
    { type: "default", field: "name", headerName: "Name", width: 200 },
    {
      type: "default",
      field: "role",
      headerName: "Role",
      width: 200,
    },
    {
      type: "default",
      field: "email",
      headerName: "Email",
      width: 180
    },
    {
      type: "default",
      field: "phone",
      headerName: "Phone No",
      width: 180,
    },
    { type: "status", field: "statusId", headerName: "Status", width: 150 }
  ];

  const filterFields: any = [
    {
      type: 'checkBox',
      fieldName: 'roleEnums',
      heading: 'Filter with Role Type',
      data: roleList,
    }
   ]
  
     /**
  * Opens the "Create Coupon Drawer" by updating the non-persisted state.
  * This function sets `craeteCouponDrawer` to `true`, triggering the drawer to open.
  */

  function handleCouponDrawer() {

    setNonPersistedDataById('craeteUserDrawer', { value: true })

  };

  const CreateUserDrawer = useStore(state => state.nonPersistedData?.['craeteUserDrawer']?.value) || false;

  /**
  * Fetches the list of coupons whenever the `CreateCouponDrawer` dependency changes.
  * This ensures that the coupon list is updated when a new coupon is created
  * or when the drawer state is modified.
  */
  useEffect(() => {
    getRoleList();
    
  }, [CreateUserDrawer]);
    return(
        <Grid container className="custom-list">
            <Grid size={{ xs: 4 }}>
                <Typography className="custom-list-list-title" gutterBottom>
                    Users
                </Typography>
            </Grid>
        <Grid
          container
          size={{ xs: 8 }}
          spacing={2}
          justifyContent="flex-end"
        >
          <Grid container >
            <CustomAutocomplete
              name="search"
              className="custom-search-text-field"
              placeholder="Search by name"
              control={control}
              options={searchResults}
              getOptionLabel={(option: any) =>
                option.firstName || ""
              }
              onSearch={handleSearch}
              loading={loading}
              onChange={handleAutocompleteChange}
            />
          </Grid>
          <Grid container >
          <CustomButton
            className="create-coupon-create-btn"
            label="Create New User"
            variant="contained"
            size="large"
            type="submit"
            startIcon={<AddIcon />}
            onClick={
              handleCouponDrawer}
          />
           <Filter datagridId='data-role-list' fields={filterFields} />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <DataGridList
            dataTransformer={transformData}
            source={source}
            title="Event Partcipant List"
            hideFooterPagination={false}
            columns={columns}
            id="data-role-list"
            // onRowClick={(params:any) => handleRowClick(params.id)}
            noRecordIcon={<NoUserList className="userdetail-noimage"/>}
            noRecordSubtitle="It's looks like you haven't created any users yet."
          />
        </Grid>

        <Grid>
            <CustomDrawer open={CreateUserDrawer} type={"right"}>
               <CreateNewUsers refreshUserRoles={UserRoleList}/>
            </CustomDrawer>
        </Grid>

      </Grid>
    );

}

export default AdminUsersList;