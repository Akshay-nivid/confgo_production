import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CouponDashboardIcon,CalendarEventIcon, DashboardUserIcon } from '@/assets/svg';
import { Drawer,List,ListItem,ListItemText,ListItemButton,useMediaQuery } from '@mui/material';
import { EventIcon, PaymentHistoryIcon } from '@/assets/svg';
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
    icon: EventIcon,
    label: 'My Events',
    exact: false,
  },
  {
    path: routes.upcomingEvents(),
    icon: EventIcon,
    label: 'Upcoming Events',
    exact: false,
  },
  {
    path: routes.paymentHistory(),
    icon: PaymentHistoryIcon,
    label: 'Payment History',
    exact: false,
  },
  {
    path: routes.userCoupons(),
    icon: CouponDashboardIcon,
    label: 'Coupons',
    exact: false,
  },
  {
    path: routes.calendar(),
    icon: CalendarEventIcon,
    label: 'Calendar',
    exact: false,
  },
];

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
      variant={isMobile ? 'temporary' : 'persistent'} // 'temporary' on mobile for minimizable drawer
      anchor="left"
      open={open}
      onClose={onClose} // Close drawer in mobile view when clicking outside
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
              <NavLink to={item.path} key={item.path} onClick={isMobile ? onClose : undefined}>
                <ListItem>
                  <ListItemButton>
                    <item.icon
                      className={isActive ? 'sidebar-list-active-drawer-icon' : ''}
                    />
                    <ListItemText className={isActive ? 'active-link' : ''}>
                      {item.label}
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              </NavLink>
            );
          })}
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
