import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import TopMenuSection from '@/pages/events/template/TopMenuSection';
import useStore from '@/Libs/store';


/**
 * 
 * @returns 
 */
const UserLayout = () => {

  const templateId = useStore((state: any) => state.compData?.["templateId"])
  
  return (
      <Box  className="user-layout">
        <TopMenuSection temp={templateId?.id} />
        <Box className="user-layout-content">
          <Box className="user-layout-card">
            <Outlet />
          </Box>
        </Box>
      </Box>
  );
};

export default UserLayout;
