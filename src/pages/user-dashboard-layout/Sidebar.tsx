import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Drawer,List,ListItem,ListItemText,ListItemButton } from '@mui/material';

import { EventIcon, PaymentHistoryIcon } from '@/assets/svg';
import { CouponDashboardIcon, CalendarEventIcon, DashboardUserIcon } from '@/assets/svg';
import routes from '@/router/routes';

interface SidebarProps {
  open: boolean;
}

const sidebarItems = [
  {
    path: routes.dashboard(),
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

/**
 * Component used to render user dashboard sidebar
 * @returns
 */
const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
  //Function to check current path - Active path
  const isActiveLink = (path: string, exact: boolean) => {
    const isActive = exact
      ? location.pathname.includes(path)
      : location.pathname.startsWith(path);
    return isActive;
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="sidebar-dashboard"
    >
      <div className="px-[1.666rem] flex-1 sidebar-dashboard">
        <List className="sidebar-list">
          {sidebarItems.map((item) => {
            const isActive = isActiveLink(item.path, item.exact);

            return (
              <NavLink to={item.path} key={item.path}>
                <ListItem>
                  <ListItemButton>
                    <item.icon
                      className={
                        isActive ? 'sidebar-list-active-drawer-icon' : ''
                      }
                    />
                    <ListItemText  className={
                        isActive ? 'active-link' : ''
                      }>{item.label}</ListItemText>
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
