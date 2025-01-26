import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import {
  CalenderIcon,
  CouponIcon,
  EventIcon,
  DashboardIcon,
  UserCreateIcon,
} from '@/assets/svg';
import routes from '@/router/routes';
import { clearDataById } from '@/Libs/store/store';

import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

interface SidebarProps {
  open: boolean;
}

const sidebarItems = [
  {
    path: routes.dashboard(),
    icon: DashboardIcon,
    id:'sidebar-dashboard-button',
    label: 'Dashboard',
    exact: true,
  },
  {
    path: routes.events(),
    icon: EventIcon,
    id:'sidebar-event-button',
    label: 'Events',
    exact: false,
  },
  {
    path: routes.coupon(),
    icon: CouponIcon,
    id: 'sidebar-coupon-button',
    label: 'Coupon',
    exact: false,
  },
  {
    path:routes.users(),
    icon:UserCreateIcon,
    id:'sidebar-user-button',
    label:'Users',
    exact:false

  },
  {
    path: routes.sponsor(),
    icon: HandshakeOutlinedIcon,
    id:'sidebar-sponsor-button',
    label: 'Sponsors',
    exact: false,
  },
  {
    path: routes.calendar(),
    icon: CalenderIcon,
    id:'sidebar-calender-button',
    label: 'Calendar',
    exact: false,
  },

];

/**
 * Component used to render sidebar
 * @returns
 */
const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  /**
   * clear the tabValue deafult value is one
   */
  useEffect(()=>{
     clearDataById("tabValue");
  });
  const location = useLocation();
  const isActiveLink = (path: string, exact: boolean) => {
    const isActive = exact
      ? path === location.pathname
      : location.pathname.startsWith(path);
    return isActive;
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      className="sidebar-drawer-admin"
    >
      <div className="px-[1.666rem] flex-1">
        <List className="sidebar-list-admin">
          {sidebarItems.map((item) => {
            const isActive = isActiveLink(item.path, item.exact);

            return (
              <NavLink to={item.path} key={item.path} id={item.id}>
                <ListItem>
                  <ListItemButton>
                    <item.icon
                      className={
                        isActive ? 'sidebar-list-admin-active-drawer-icon-admin' : ''
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
