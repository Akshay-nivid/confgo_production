import { DataGridList } from '@/components/DataGrid/DataGridList';
import { ISource } from '@/Libs/type';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '@/router/routes';
import useStore from '@/Libs/store';

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
  const navigate = useNavigate();
  const userDetails = useStore(state => state?.compData?.['userDetails']) ?? {};

  const [source, setSource] = useState<ISource | undefined>(undefined);

  const [dataList, setAbstractList] = useState<IDataListItem[]>([]);
  const [currentTab, setCurrentTab] = useState(1);

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
      headerName: 'Created Date',
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
    abstractList();
  }, []);

  const abstractList = useCallback(() => {
    const req = {
      offset: 0,
      limit: 5,
      sortBy: 'id',
      sortDirection: 'DESC',
      filters: { reviewerId: userDetails.id },
    };

    setSource({
      method: 'POST',
      data: req,
      url: `userAbstract/list`,
      listName: 'abstractList',
    });
    return;
  }, []);

  /**
   * Transforms the raw data from the API to match the required format for the DataGrid component.
   * @param data - The raw data from API response
   * @returns Transformed data for DataGrid
   */
  const transformData = useCallback(
    (data: IDataListItem[] = []) => {
      setAbstractList(data);

      const transformedData = data.map(item => ({
        ...item,
        eventClass: item.event?.eventClass,
        eventName: item.event?.name,
      }));
          
         

      switch (currentTab) {
        case 1:
          return transformedData;
        case 2:
          return transformedData.filter(item => item.statusId === 4); // 4-assigned
        case 3:
          return transformedData.filter(item => item.statusId === 2 || item.isReviewed === 1);  
        case 4:
          return transformedData.filter(item => item.statusId === 1 ); // 1 - approved 
        case 5:
          return transformedData.filter(item => item.statusId === 2 ); // 2 - rejected
        default:
          return [];
      }
    },
    [currentTab]
  );

  const tabs = ['Total Abstracts', 'Pending for Review', 'Reviewed Abstracts', 'Approved', 'Rejected'];

  const summaryData = [
    {
      id: 1,
      title: 'Total Abstracts',
      value: dataList.length,
    },
    {
      id: 2,
      title: 'Pending for Review',
      value: dataList.filter(item => item.isReviewed === 0).length,
    },
    {
      id: 3,
      title: 'Reviewed Abstracts',
      value: dataList.filter(item => item.isReviewed === 1).length,
    },
    {
      id: 4,
      title: 'Approved',
      value: dataList.filter(item => item.isReviewed === 1 && item.statusId === 1).length,
    },
    {
      id: 5,
      title: 'Rejected',
      value: dataList.filter(item => item.isReviewed === 1 && item.statusId === 2).length,
    },
  ];

  /**
   * Handles the click event on the summary tabs.
   * @param {number} index - The index of the tab to be selected.
   */
  const handleClick = (index: number) => {
    setCurrentTab(index);
  };
  /**
   * Navigates to the review details page when a row is clicked in the DataGrid.
   * @param {number|string} id - The ID of the abstract to view.
   */

  const handleRowClick = (id: number | string) => {
    navigate(routes.reviewDetails(id));
  };

  return (
    <Box className="reviewer-main reviewer-home-main">
      {/* <ReviewerNavbar /> */}

      <Grid container justifyContent={'center'}>
        <Grid size={11} className="banner-container">
          <Typography className="banner-title">
            Welcome, {userDetails?.firstName} {userDetails?.lastName}! 👋
          </Typography>
          <Typography className="banner-subtitle">Manage your tasks for Global Healthcare Innovations Summit 2024.</Typography>
        </Grid>

        <Grid size={11} className="abstracts-summary-container">
          <Typography className="abstracts-summary-title">Abstracts Summary</Typography>

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
            {tabs.map((tab, index) => {
              return <TabButton onclick={() => handleClick(index+1)} key={index} text={tab} active={index + 1 === currentTab} />;
            })}
          </Box>

          <Box className="data-grid-container">
            <DataGridList
              columns={columns}
              key={currentTab}
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
  return (
    <Box>
      <Typography className="abstracts-summary-content-title">{title} </Typography>
      <Typography className="abstracts-summary-content-value">{value}</Typography>
    </Box>
  );
};
