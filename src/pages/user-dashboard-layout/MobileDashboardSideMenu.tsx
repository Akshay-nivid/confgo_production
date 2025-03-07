import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {  CalenderEventMobIcon, DashboardUserMobIcon, PaymentHistoryMobIcon, SettingsDashBoardMobIcon,MyEventsMobIcon } from '@/assets/svg';
import {  Drawer, List, ListItem, ListItemText, ListItemButton, Divider } from '@mui/material';
import routes from '@/router/routes';
import { useIsMobileScreen } from '@/Utils/CommonBaseClass';
import Grid from '@mui/material/Grid2'
import CloseIcon from '@mui/icons-material/Close';
interface MobileDashboardSideMenuProps {
  open: boolean;
  onClose: () => void; // Add onClose for closing in mobile view
}

const sidebarItems = [
  {
    path: routes.userHome(),
    icon: DashboardUserMobIcon,
    label: 'Dashboard',
    exact: true,
  },
  {
    path: routes.userMyEvents(),
    icon: MyEventsMobIcon,
    label: 'My Events',
    exact: true,
  },
  {
    path: routes.paymentHistory(),
    icon: PaymentHistoryMobIcon,
    label: 'Payment History',
    exact: true,
  },
  {
    path: routes.userCalendar(),
    icon: CalenderEventMobIcon,
    label: 'Calendar',
    exact: true,
  },
  {
    path: routes.accountsettings(), 
    icon: SettingsDashBoardMobIcon,
    label: 'Settings',
    exact: true,
    state: { tabIndex: 0 }, 
  },
];

/**
 * Componet used for side bar menu of mobile view
 * @param param0 
 * @returns 
 */
const MobileDashboardSideMenu: React.FC<MobileDashboardSideMenuProps> = ({ open, onClose }) => {
  const location = useLocation();
  const isMobile = useIsMobileScreen(); // Adjust breakpoint as needed

  const isActiveLink = (path: string, exact: boolean) => {
    return exact
      ? location.pathname.includes(path)
      : location.pathname.startsWith(path);
  };

  return (
    <Grid bgcolor={'black'}>
    <Drawer
      anchor="left"
      open={open}
      
      onClose={onClose} 
      className="user-sidebar-dashboard-responsive"
      ModalProps={{
        keepMounted: true, // Keeps the drawer in the DOM on mobile to avoid reloading
      }}
    >
        <Grid className="user-sidebar-dashboard-responsive-close-icon-grid">
        <Grid ><CloseIcon className='close-icon' onClick={onClose}/></Grid>
        </Grid>
        <Grid className = "user-sidebar-dashboard-responsive-menu-container">
            <Grid className = "user-sidebar-dashboard-responsive-menu-container-item-list">
            <List className="user-sidebar-list">
          {sidebarItems.map((item, index) => {
            const isActive = isActiveLink(item.path, item.exact);
            return (
              <React.Fragment key={item.path}>
                <NavLink to={item.path} state={item.state} onClick={isMobile ? onClose : undefined }>  
                  <ListItem>
                    <ListItemButton>
                      <item.icon className={isActive ? 'active-drawer-icon' : 'inactive-drawer-icon'} />
                      <ListItemText className={isActive ? 'active-link' : ''}>
                        {item.label}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                </NavLink>
                {index  < sidebarItems.length - 1 && <Divider className='line-divider'/>}
              </React.Fragment>
            );
          })}
        </List>  
            </Grid>
        </Grid>
    </Drawer>
    </Grid>
  );
};

export default MobileDashboardSideMenu;
