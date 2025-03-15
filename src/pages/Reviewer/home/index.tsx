import { DataGridList } from '@/components/DataGrid/DataGridList';
import { ISource } from '@/Libs/types/type';
import { Box, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import useStore, { GET } from '@/Libs/store';
import CustomAutocomplete from '@/components/CustomAutocomplete/CustomAutocomplete';
import { useForm } from 'react-hook-form';


interface IDataListItem {
  id: number;
  eventClass: string;
  eventName: string;
  isReviewed: number;
  status: number;
  createdOn: string;
  startTime: string;
  statusId: number;
  event: {
    eventClass: string;
    name: string;
    startTime: string;
  };
}


/**
 * ReviewerHome component renders the home page for the reviewer.
 * It displays a welcome banner, an abstracts summary, and tasks management
 * for the Global Healthcare Innovations Summit 2024.
 * The component includes:
 * - A logo and avatar in the navigation bar.
 * - A welcome message for the reviewer.
 * - A summary of abstracts with statistics on total, pending, reviewed,
 *   approved, and rejected abstracts.
 * - Tabs for different categories of abstracts.
 * - A DataGrid for detailed information.
 * @returns {JSX.Element} The ReviewerHome component.
 * @constructor
 */

const ReviewerHome = () => {

  const TABS = {
    TOTAL_ABSTRACTS: 'Total Abstracts',
    PENDING_FOR_REVIEW: 'Pending for Review',
    REVIEWED_ABSTRACTS: 'Reviewed Abstracts',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  }

  const form = useForm();
  const navigate = useNavigate();
  const userDetails = useStore(state => state?.compData?.['userDetails']) ?? {};

  const [source, setSource] = useState<ISource | undefined>(undefined);

  // const [dataList, setAbstractList] = useState<IDataListItem[]>([]);
  const [currentTab, setCurrentTab] = useState(TABS.TOTAL_ABSTRACTS);

  const [refreshKey, setRefreshKey] = useState(0);

  const abstractList = useStore(state => state?.compData?.['reviewer-datagrid']?.data) ?? [];

  const abstractSummaryData = useStore(state => state?.compData?.['abstractSummaryData']?.['dashBoard/abstractCount']) || {};

  const [currectEventId, setCurrectEventId] = useState<number | null>(null)


  const columns = [
    { type: 'default', field: 'id', headerName: 'ID', width: 150 },
    {
      type: 'default',
      field: 'eventName',
      headerName: 'Event Name',
      width: 250,
    },
    { type: 'default', field: 'eventClass', headerName: 'Type', width: 200 },
    {
      type: 'dateField',
      field: 'createdOn',
      headerName: 'Uploaded Date',
      width: 250,
      dateFormat: 'DD/MM/YYYY',
    },
    {
      type: 'dateField',
      field: 'startTime',
      headerName: 'Start Date',
      width: 250,
      dateFormat: 'DD/MM/YYYY',
    },
    {
      type: 'status',
      field: 'statusId',
      headerName: 'Status',
      width: 150,
      sortable: false,
    },
  ];

  useEffect(() => {

    const getStatusId = () => {

      switch (currentTab) {
        case TABS.TOTAL_ABSTRACTS:
          return {}
        case TABS.PENDING_FOR_REVIEW:
          return { isReviewed: 0 }
        case TABS.REVIEWED_ABSTRACTS:
          return { isReviewed: 1 }
        case TABS.APPROVED:
          return { statusId: 1 }
        case TABS.REJECTED:
          return { statusId: 2 }
      }
    }

    const isEventId = currectEventId ? { eventId: currectEventId } : {}

    const req = {
      offset: 0,
      limit: 5,
      sortBy: 'id',
      sortDirection: 'DESC',
      filters: { reviewerId: userDetails.id, ...getStatusId(), ...isEventId },
    };

    setSource({
      method: 'POST',
      data: req,
      url: `userAbstract/list`,
      listName: 'abstractList',
    });
  }, [currentTab, refreshKey]);


  useEffect(() => {
    GET({ url: 'dashBoard/abstractCount', id: 'abstractSummaryData' })
  }, [])


  /**
   * Maps the statusId received from the API to the statusId used in the front-end.
   * @param statusId - The statusId received from the API.
   * @returns The mapped statusId used in the front-end.
   */
  function convertStatusId(statusId: number) {
    switch (statusId) {
      case 1:
        return 9
      case 2:
        return 10
      case 4:
        return 3
      default:
        return 3
    }
  }

  /**
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  const transformData = (data: IDataListItem[] = []) => {
    return data.map(item => {
      return {
        ...item,
        eventClass: item.event?.eventClass,
        eventName: item.event?.name,
        startTime: item.event?.startTime,
        statusId: convertStatusId(item?.statusId),
      };
    });
  };

  const summaryData: { id: number; title: 'Total Abstracts' | 'Pending for Review' | 'Reviewed Abstracts' | 'Approved' | 'Rejected'; value: number }[] = [
    {
      id: 1,
      title: 'Total Abstracts',
      value: abstractSummaryData?.data?.totalAbstracts,
    },
    {
      id: 2,
      title: 'Pending for Review',
      value: abstractSummaryData?.data?.pendingForReview,
    },
    {
      id: 3,
      title: 'Reviewed Abstracts',
      value: abstractSummaryData?.data?.reviewedAbstracts,
    },
    {
      id: 4,
      title: 'Approved',
      value: abstractSummaryData?.data?.approvedAbstract,
    },
    {
      id: 5,
      title: 'Rejected',
      value: abstractSummaryData?.data?.rejectedAbstracts,
    },
  ];

  /**
   * Handles the click event on the summary tabs.
   * @param {number} index - The index of the tab to be selected.
   */
  const handleClick = (tab: 'Total Abstracts' | 'Pending for Review' | 'Reviewed Abstracts' | 'Approved' | 'Rejected') => {
    setCurrentTab(tab);
  };
  /**
   * Navigates to the review details page when a row is clicked in the DataGrid.
   * @param {number|string} id - The ID of the abstract to view.
   */

  const handleRowClick = (id: number | string) => {
    navigate(routes.reviewDetails(id));
  };


  const [eventAbstarctList, setEventAbstractList] = useState<any>([])

  /**
   * Searches the list of abstracts by event name and updates the state with the filtered results.
   * @param {string} query - The search query to filter the abstracts by.
   */
  function onSearch(query: string) {

    const filteredData = abstractList.filter((item: any) => item?.eventName.toLowerCase().includes(query.toLowerCase()));

    setEventAbstractList(filteredData);

  }

  /**
   * Handles the change event on the event selector dropdown.
   * Updates the current event ID and sets the current tab to the total abstracts tab.
   * @param {object} data - The event data selected from the dropdown.
   */
  function handleOnChange(data: any) {

    setCurrectEventId(data.eventId)

    setRefreshKey(prev => prev + 1)


  }


  return (
    <Box className="reviewer-main reviewer-home-main">

      <Grid container justifyContent={'center'}>
        <Grid size={11} className="banner-container">
          <Typography className="banner-title">
            Welcome, {userDetails?.firstName} {userDetails?.lastName}! 👋
          </Typography>
          <Typography className="banner-subtitle">Manage your tasks for assigned events</Typography>
        </Grid>

        <Grid size={11} className="abstracts-summary-container">
          <Box className="search-container">
            <Typography className="abstracts-summary-title">Abstracts Summary</Typography>

            <CustomAutocomplete
              name="search"
              className="search-input w-full max-w-xl ml-auto"
              control={form.control}
              options={eventAbstarctList}
              getOptionLabel={(option: any) => option.eventName || ''}
              onSearch={onSearch}
              loading={false}
              placeholder="Search events"
              onChange={handleOnChange}

            />
          </Box>

          <Box className="abstracts-summary-content">
            {summaryData.map((item: (typeof summaryData)[0], index: number) => {
              return (
                <>
                  <SummaryCard key={item.id} title={item.title} value={item.value} />
                  {index === summaryData.length - 1 ? null : <Box className="divider"></Box>}
                </>
              );
            })}
          </Box>

          <Box className="review-tabs">
            {summaryData.map((tab, index) => {
              return <TabButton onclick={() => handleClick(tab.title)} key={index} text={tab.title} active={tab.title === currentTab} />;
            })}

          </Box>

          <Box className="data-grid-container">


            <DataGridList
              columns={columns}
              source={source}
              dataTransformer={transformData}
              id="reviewer-datagrid"
              title="Event"
              noRecordSubtitle="No abstracts found"
              hideFooterPagination={false}
              onRowClick={(params: any) => handleRowClick(params.id)}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReviewerHome;

/**
 * TabButton component renders a button that acts as a tab
 * @param {string} text The text to be displayed in the button
 * @param {boolean} active Whether the button is currently active
 * @param {() => void} onclick The function to call when the button is clicked
 * @returns {JSX.Element} The rendered button
 */
const TabButton = ({ text, active, onclick }: { text: string; active: boolean; onclick: () => void }) => {
  return (
    <Box onClick={onclick} className={clsx('item', active && 'active')}>
      <Typography className={clsx('abstracts-summary-content-title', active && 'text-active')}>{text}</Typography>
    </Box>
  );
};

/**
 * SummaryCard component renders a card with a title and value
 * @param {string} title The title of the card
 * @param {number} value The value of the card
 * @returns {JSX.Element} The rendered card
 */
const SummaryCard = ({ title, value }: { title: string; value: number }) => {

  const summaryData = useStore(state => state?.compData?.['abstractSummaryData']?.['dashBoard/abstractCount']) || false;

  return (
    <Box>
      <Typography className="abstracts-summary-content-title">{title} </Typography>
      <Typography className="abstracts-summary-content-value">
        {
          summaryData?.loading ? <Skeleton /> : value
        }
      </Typography>
    </Box>
  );
};




