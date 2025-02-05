import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import CustomButton from "@/components/CustomButton/CustomButton";
import { ISource } from "@/Libs/types/type";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { Logger } from "@/Utils/Logger";
import { useParams } from "react-router-dom";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import AssignedVolunteers from "./AssignedVolunteers";
import { IconButton } from "@mui/material";
import DeleteIcon from "@/assets/svg/DeleteIcon.svg";
import { NoCouponDataSvg } from "@/assets/svg";


/**
 * Component to display a list of volunteers with search, assign and filter functionality.
 */
const VolunteerListCard = () => {
  const { id } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  // const [filters, setFilters] = useState({ });
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeOrganisationDrawer = () => setDrawerOpen(false);


  const { control } = useForm();
  /**
   * Fetches the volunteer list when the component mounts.
   */
  useEffect(() => {
    volunteerList();
  }, []);

  /**
   * Function to set the initial request configuration for fetching volunteer data.
   */
  const volunteerList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      filters:{
      eventId:id,
      statusId:1
      }
    };

    setSource({
      method: "POST",
      data: req,
      url: `user/volunteerEvent/list`,
      listName: "volunteerList",
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
        id: item?.id,
        name: `${item?.user?.firstName} ${item?.user?.lastName}`,
        email: item?.user?.email,
        phone: item?.user?.phone,
        status: item?.statusId
      };
    });
  };

  /**
   * Updates the source for the data grid when an autocomplete selection is made.
   * @param selected - The selected item from the autocomplete list
   */
  const handleAutocompleteChange = (selected: any) => {
    if (selected) {
      setSource({
        method: "POST",
        data: {
          offset: 0,
          limit: 5,
          filters: {
            statusId:1,
            eventId:id,
            userId: selected?.user?.id,
          },
        },
        url: `user/volunteerEvent/list`,
        listName: "eventVolunteerList",
      });
    }
  };


  /**
   * Searches participants based on the query entered by the user.
   * @param query - The search query entered by the user
   */
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      let req = {
        filters: {
          eventId:id,
          statusId:1,
          name: query,
        },
      };
      const response =  await apiClient.post(
        `user/volunteerEvent/list`,
        req
      );
      const { status, data } = processAPIResponse(
        response,
        "eventPartcipantList"
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
    // {
    //   type:"default",
    //   field:"Action",
    //   headerName: "Action",
    //   width:100,
    //   renderCell: (params: any) => (
    //     <IconButton
    //       onClick={() => handleDelete(params.row.id)}
    //     >
    //       <DeleteIcon />
    //     </IconButton>
    //   ),
    // }
  ];

  const onClose = () => {
    closeOrganisationDrawer();
  }

  /**
   * For deleting the assigned volunteer from the list
   */
  const handleDelete = async(volunteerId: number) => {
    try{     
        await apiClient.delete(`user/volunteerEvent/${volunteerId}`)
        volunteerList();

    } catch (error) {
        Logger.error(error,"AssignedVolunteers.tsx");
    }
};

  return (
    <Grid container>
      <Grid
        container
        size={{ xs: 12 }}
        className="volunteer-list-card"
        spacing={2}
        justifyContent="flex-end"
      >
        <Grid container>
          <CustomAutocomplete
            name="search"
            className="custom-user-search-field"
            placeholder="Search by Name, Phone or email ..."
            control={control}
            options={searchResults}
            getOptionLabel={(option: any) =>
              option?.user?.firstName || ""
            }
            onSearch={handleSearch}
            loading={loading}
            onChange={handleAutocompleteChange}
          />
        </Grid>
        <Grid container spacing={2}>
          <CustomButton
            className="custom-green-btn"
            onClick={() => {
              setDrawerOpen(true);
            }}
            label="Assign"
            startIcon={<AddIcon />}
            size="large"
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <DataGridList
          dataTransformer={transformData}
          source={source}
          title="Volunteers"
          hideFooterPagination={false}
          columns={columns}
          id="volunteer-lists"
          noRecordIcon={<NoCouponDataSvg className="no-coupon-icon"/>}
          noRecordSubtitle="It looks like you haven't created any volunteer yet."
        />
      </Grid>

      <CustomDrawer open={drawerOpen} type="right">
        <AssignedVolunteers onClose={onClose}   volunteerList={volunteerList} 
 />
      </CustomDrawer>
    </Grid>
  );
};

export default VolunteerListCard;
