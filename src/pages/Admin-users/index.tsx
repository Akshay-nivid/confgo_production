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
import useStore, { PUT, setDataById, setNonPersistedDataById } from "@/Libs/store";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import CreateNewUsers from "./CreateUsers";
import { IconButton, Menu, MenuItem } from "@mui/material";
import EditUserDrawer from "./EditUserDrawer";
import DeleteIcon from "@/assets/svg/DeleteIcon.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {UserNoData} from "@/assets/svg";
import {Writing} from "@/assets/svg";


interface Role {
  value: string,
  name: string
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
type UserData = {
  id: number;
  firstName: string;
  lastName: string;
};
/**
 * componet for showing full Admin created Company User List
 */
const AdminUsersList = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false); // To indicate loading state for API
  const POST = useStore((state: any) => state.POST);
  const { control } = useForm();
  const [roleList, setRoleList] = useState<Role[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [rowData, setRowData] = useState<number | null>(null);


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
    const companyId = sessionStorage.getItem('companyId')
    const req = {
      sortDirection: "DESC",
      sortBy: 'id',
      offset: 0,
      limit: 5,
      filters: {
        statusId: 1,
        companyId: companyId,
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

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    userId: number,
    item: any
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentUserId(userId);
    setRowData(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentUserId(null);
    setRowData(null);
  };

  /**
   * delete user
   */
  const handleDelete = async (id: number) => {
    try {
      await PUT({
        url: `user/update/${id}`,
        body: {
          statusId: 2
        },
        id: 'user-updated',
        successCB: (_data: any) => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'success', message: "User Deleted Successfully" });
          UserRoleList();

        },
        errorCB: (context: any) => {
          setDataById('snackBarInfo', { open: true, autoHideDuration: 2000, severity: 'error', message: context?.message });
        }
      });
    } catch (error) {
      Logger.error("Error in user/update/id api call ", error)
    }
    handleMenuClose();

  }

  /**
   * Handles row click event to open the edit drawer with selected user data.
   * @param rowData - The data of the clicked row.
   */
  const handleRowClick = (e: React.MouseEvent, rowData: any) => {
    e.preventDefault()
    e.stopPropagation()
    const transformedEditData: UserData = {
      id: rowData.id,
      firstName: rowData.firstName,
      lastName: rowData.lastName,
    };
    setIsDrawerOpen(true);
    setSelectedUser(transformedEditData);
    handleMenuClose();
  };

  /**
   * Closes the edit drawer and resets the selected user.
   */
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

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
        name: `${item?.firstName} ${item?.lastName}`,
        role: item?.userRoles[0]?.role?.roleName,
        email: item?.email,
        phone: item?.phone,
        status: item?.user?.statusId,
        actions: (
          <IconButton onClick={(e) => handleMenuOpen(e, item.id, item)}>
            <MoreHorizIcon />
          </IconButton>
        ),
      };
    });
  };
  /**
   * fetching full role list 
   */
  const getRoleList = async () => {
    await POST({
      url: 'role/list',
      body: {
        filters: {
          statusId: 1
        },
        "offset": 0,
        "limit": 100,
        "sortBy": "id",
        "sortDirection": "DESC",
      },
      id: 'user-role-list',
      successCB: (context: any) => {
        let roleData: Role[] = [];
        context.data.forEach((item: RoleList) => {
          if (![1, 2, 3].includes(item.id)) {
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
    const companyId = sessionStorage.getItem('companyId')
    if (selected) {
      setSource({
        method: "POST",
        data: {
          offset: 0,
          limit: 5,
          filters: {
            statusId: 1,
            userId: selected.id,
            companyId: companyId,
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
    const companyId = sessionStorage.getItem('companyId')
    setLoading(true);
    try {
      let req = {
        filters: {
          statusId: 1,
          name: query,
          companyId: companyId,
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
    { type: "default", field: "id", headerName: "ID", width: 100 },
    { type: "custom", field: "name", headerName: "Name", width: 150 },
    {
      type: "default",
      field: "role",
      headerName: "Role",
      width: 150,
    },
    {
      type: "custom",
      field: "email",
      headerName: "Email",
      width: 180
    },
    {
      type: "default",
      field: "phone",
      headerName: "Phone No",
      width: 150,
      sortable: false
    },
    { type: "status", field: "statusId", headerName: "Status", width: 120,sortable: false },
    { type: "custom", field: "actions", headerName: "", width: 150 ,sortable: false},
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
    UserRoleList();

  }, [CreateUserDrawer]);
  return (
    <Grid container className="custom-list user-list-main">
      <Grid size={{ xs: 4 }}>
        <Typography className="custom-list-list-title" gutterBottom>
          Users
        </Typography>
      </Grid>
      <Grid
        container
        size={{ xs: 12, sm: 8 }}
        spacing={2}
        justifyContent="flex-end"
        className="user-filter-container"
      >
        <Grid container >
          <CustomAutocomplete
            name="search"
            className="custom-search-text-field textfield-border"
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
        <Grid container
          className="user-filter-container"
        >
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
      <Grid size={{ xs: 12 }} className="shadow-app app-border-radius mt-8">
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
        >
          <MenuItem onClick={(e) => handleRowClick(e, rowData)}>
           {/* <img src="/src/assets/png/writing.png" alt="Edit" className="action-icon" /> */}
           <Writing className="action-icon"/>
            <Typography className="action-text">Edit</Typography>
          </MenuItem>
          <MenuItem onClick={() => {
            if (currentUserId !== null) {
              handleDelete(currentUserId);
            }
          }}>

            <DeleteIcon className="action-icon" />
            <Typography className="action-text">Delete</Typography>
          </MenuItem>
        </Menu>
        <DataGridList
          dataTransformer={transformData}
          source={source}
          title="Event Partcipant List"
          hideFooterPagination={false}
          columns={columns}
          id="data-role-list"
          // onRowClick={(params:any) => handleRowClick(params.row)}
          noRecordIcon={
          <UserNoData />
          }
        noRecordTitle="No Users Found"
        noRecordSubtitle="Manage event team members and assign roles for smooth collaboration. Add users to start organizing efficiently."
        />
      </Grid>
      <Grid>
        <CustomDrawer
          children={selectedUser && <EditUserDrawer data={selectedUser} closeDrawer={closeDrawer} onSuccess={UserRoleList} />}
          open={isDrawerOpen}
          type="right"
        />
      </Grid>
      <Grid>
        <CustomDrawer open={CreateUserDrawer} type={"right"}>
          <CreateNewUsers refreshUserRoles={UserRoleList} />
        </CustomDrawer>
      </Grid>

    </Grid>
  );

}

export default AdminUsersList;