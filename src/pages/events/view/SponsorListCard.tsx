import CustomAutocomplete from "@/components/CustomAutocomplete/CustomAutocomplete";
import CustomButton from "@/components/CustomButton/CustomButton";
import { ISource } from "@/Libs/types/type";
import Grid from "@mui/material/Grid2";
import { useCallback, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import apiClient from "@/Libs/Https/API-client";
import { processAPIResponse } from "@/Utils/CommonBaseClass";
import { DataGridList } from "@/components/DataGrid/DataGridList";
import { Logger } from "@/Utils/Logger";
import { useParams } from "react-router-dom";
import CustomDrawer from "@/components/CustomDrawer/CustomDrawer";
import { Avatar } from "@mui/material";
import { NoCouponDataSvg } from "@/assets/svg";
import AssignedSponsors from "./AssignedSponsor";
import config from "../../../../config.json";
import { POST, setDataById } from "@/Libs/store";

interface Sponsor {
  value: number;
  label: string;
}

interface sponsorprops {
  drawerOpened?: boolean;
  expanded?: any;
  // eventData?:any
}
/**
 * Component to display a list of volunteers with search, assign and filter functionality.
 */
const SponsorListCard: React.FC<sponsorprops> = ({
  drawerOpened,
  expanded,
}) => {
  const { id } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  // const [filters, setFilters] = useState({ });
  const [source, setSource] = useState<ISource | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeOrganisationDrawer = () => setDrawerOpen(false);
  const [sponsorType, setSponsorType] = useState<Sponsor[]>([]);
  const [isSponsorTypeLoading, setIsSponsorTypeLoading] = useState(true); // Track loading state for sponsorType

  const { control } = useForm();

  useEffect(() => {
    getSponsor();
  }, []);

  useEffect(() => {
    drawerOpened && expanded == "panel4-header"
      ? setDrawerOpen(true)
      : setDrawerOpen(false);
  }, [expanded]);

  /**
   * Fetches the volunteer list when the component mounts.
   */
  useEffect(() => {
    sponsorList();
  }, []);
  const getSponsor = async () => {
    setIsSponsorTypeLoading(true); // Set loading state to true
    await POST({
      url: "sponsorType/list",
      body: {},
      id: "sponsorType-list",
      successCB: (_context: any) => {
        let _sponsor: any = [];
        _context.data.forEach((item: any) => {
          _sponsor.push({
            value: item?.id,
            label: item?.name,
          });
        });
        setSponsorType(_sponsor);
        setIsSponsorTypeLoading(false); // Set loading state to false after data is fetched
      },
      errorCB: (context: any) => {
        setDataById("snackBarInfo", {
          open: true,
          autoHideDuration: 2000,
          severity: "error",
          message: context?.message,
        });
        setIsSponsorTypeLoading(false); // Set loading state to false after data is fetched
      },
    });
  };

  /**
   * Function to set the initial request configuration for fetching volunteer data.
   */
  const sponsorList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      filters: {
        parentEventId: id,
      },
    };

    setSource({
      method: "POST",
      data: req,
      url: `sponsor/list`,
      listName: "sponsorList",
    });
    return;
  }, []);

  const baseUrl = config.api.url;

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
        name: item?.name,
        email: item?.email,
        phone: item?.phone,
        sponsorType:
          sponsorType.find(
            (type) => type.value === item?.eventSponsors[0]?.sponsorTypeId
          )?.label || "-",
        status: item?.statusId,
        logo: (
          <Avatar
            className="top-2"
            src={`${baseUrl}/asset/${item?.logoAssetId}`}
          >
            {item?.name?.slice(0, 2)}
          </Avatar>
        ),
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
            parentEventId: id,
            name: selected?.name,
          },
        },
        url: `sponsor/list`,
        listName: "eventSponsorList",
      });
    }
  };

  /**
   * Searches sponsor based on the query entered by the user.
   * @param query - The search query entered by the user
   */
  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const req = {
        filters: {
          parentEventId: id,
          name: query,
        },
      };
      const response = await apiClient.post(`sponsor/list`, req);
      const { status, data } = processAPIResponse(response, "eventSponsorList");
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
    {
      type: "custom",
      field: "logo",
      headerName: "Logo",
      width: 110,
    },
    { type: "default", field: "name", headerName: "Name", width: 150 },
    {
      type: "default",
      field: "email",
      headerName: "Email",
      width: 190,
    },
    {
      type: "default",
      field: "phone",
      headerName: "Phone No",
      width: 150,
    },
    { type: "default", field: "sponsorType", headerName: "Type", width: 100 },

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
            getOptionLabel={(option: any) => option?.name || ""}
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
        {!isSponsorTypeLoading && (
          <DataGridList
            dataTransformer={transformData}
            source={source}
            title="Sponsors"
            hideFooterPagination={false}
            columns={columns}
            id="sponsor-lists"
            noRecordIcon={<NoCouponDataSvg className="no-coupon-icon" />}
            noRecordSubtitle="cIt looks like you haven't assigned any sponsor yet ."
          />
        )}
      </Grid>

      <CustomDrawer open={drawerOpen} type="right">
        <AssignedSponsors onClose={onClose} sponsorList={sponsorList} />
      </CustomDrawer>
    </Grid>
  );
};

export default SponsorListCard;
