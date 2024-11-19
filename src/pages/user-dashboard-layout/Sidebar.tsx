import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {  CalendarEventIcon, DashboardUserIcon, HeartEventIcon, SettingsIcon } from '@/assets/svg';
import {  Drawer, List, ListItem, ListItemText, ListItemButton, useMediaQuery, Divider } from '@mui/material';
import { PaymentHistoryIcon } from '@/assets/svg';
import routes from '@/router/routes';

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
    icon: PaymentHistoryIcon,
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
    icon: SettingsIcon,
    label: 'Settings',
    exact: true,
  },
];
/**
 * User dashboard sidebar
 * @author Neethu
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)'); // Adjust breakpoint as needed

  const isActiveLink = (path: string, exact: boolean) => {
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
      className="sidebar-dashboard"
      ModalProps={{
        keepMounted: true, // Keeps the drawer in the DOM on mobile to avoid reloading
      }}
    >
      <div className="sidebar-dashboard">
        <List className="sidebar-list">
          {sidebarItems.map((item) => {
            const isActive = isActiveLink(item.path, item.exact);

            return (
              <React.Fragment key={item.path}>
                <NavLink to={item.path} onClick={isMobile ? onClose : undefined}>
                  <ListItem>
                    <ListItemButton>
                      <item.icon className={isActive ? 'sidebar-list-active-drawer-icon' : ''} />
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
