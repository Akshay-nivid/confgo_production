import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { Drawer,List,ListItem,ListItemText,ListItemButton } from '@mui/material';

import { CalenderIcon,CouponIcon,EventIcon, DashboardIcon, PaymentHistoryIcon } from '@/assets/svg';
import routes from '@/router/routes';

interface SidebarProps {
  open: boolean;
}

const sidebarItems = [
  {
    path: routes.dashboard(),
    icon: DashboardIcon,
    label: 'Dashboard',
    exact: true,
  },
  {
    path: routes.events(),
    icon: EventIcon,
    label: 'My Events',
    exact: false,
  },
  {
    path: routes.events(),
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
    path: routes.coupon(),
    icon: CouponIcon,
    label: 'Coupons',
    exact: false,
  },
  {
    path: routes.calendar(),
    icon: CalenderIcon,
    label: 'Calendar',
    exact: false,
  },
];

/**
 * Component used to render sidebar
 * @returns
 */
const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const location = useLocation();
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
      className="sidebar-drawer"
    >
      <div className="px-[1.666rem] flex-1">
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
                    <ListItemText>{item.label}</ListItemText>
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
