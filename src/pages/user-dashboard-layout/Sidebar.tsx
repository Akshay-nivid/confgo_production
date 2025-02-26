import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {  CalendarEventIcon, DashboardUserIcon, HeartEventIcon, TransactionHistoryIcon, UserSettingIcon } from '@/assets/svg';
import {  Drawer, List, ListItem, ListItemText, ListItemButton, Divider } from '@mui/material';
import routes from '@/router/routes';
import { useIsMobileScreen } from '@/Utils/CommonBaseClass';

interface SidebarProps {
  open: boolean;
  onClose: () => void; // Add onClose for closing in mobile view
}

const sidebarItems = [
  {
    path: routes.userHome(),
    icon: DashboardUserIcon,
    label: 'Dashboard',
    exact: true,
  },
  {
    path: routes.userMyEvents(),
    icon: HeartEventIcon,
    label: 'My Events',
    exact: true,
  },
  {
    path: routes.paymentHistory(),
    icon: TransactionHistoryIcon,
    label: 'Payment History',
    exact: true,
  },
  {
    path: routes.userCalendar(),
    icon: CalendarEventIcon,
    label: 'Calendar',
    exact: true,
  },
  {
    path: routes.accountsettings(), 
    icon: UserSettingIcon,
    label: 'Settings',
    exact: true,
    state: { tabIndex: 0 }, 
  },
];
/**
 * User dashboard sidebar
 * @author Neethu
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const isMobile = useIsMobileScreen(); // Adjust breakpoint as needed

  const isActiveLink = (path: string, exact: boolean) => {
    const currentPath = location.pathname;
    //to make event active while in eventinfo
    if (path === routes.userMyEvents() && currentPath.includes('event-recap')) {
      return true;
    }

    return exact
      ? location.pathname.includes(path)
      : location.pathname.startsWith(path);
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onClose} 
      className="user-sidebar-dashboard"
      ModalProps={{
        keepMounted: true, // Keeps the drawer in the DOM on mobile to avoid reloading
      }}
    >
      <div className="user-sidebar-dashboard">
        <List className="user-sidebar-list">
          {sidebarItems.map((item) => {
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

                {/* Add divider after Calendar item and apply margin */}
                {item.label === 'Calendar' && <Divider className='sidebar-divider'/>}

               
              </React.Fragment>
            );
          })}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
