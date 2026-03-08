import { Home } from 'lucide-react';
import { ComponentsIcons, Icons } from '../../assets/icons';
import { ROUTES } from './routes';

export const sidebarData = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: ComponentsIcons.LayoutDashboard,
      color: '#3b82f6',
    },
    {
      title: 'Report',
      url: ROUTES.REPORT,
      icon: ComponentsIcons.ChartNoAxesGanttIcon,
      color: '#3b82f6',
    },
  ],
  navSuport: [
    {
      title: 'Ticket',
      url: '/ticket',
      icon: ComponentsIcons.Bug,
      color: '#3b82f6',
    },
  ],
};

export const adminData = {
  navMain: [
    {
      title: 'Dashboard',
      url: ROUTES.DASHBOARD,
      icon: ComponentsIcons.LayoutDashboard,
    },
    {
      title: 'System Monitor',
      url: '/admin/health',
      icon: Icons.Monitor,
    },
  ],
  navAdmin: [
    {
      title: 'User',
      url: '/admin/user',
      icon: ComponentsIcons.GroupIcon,
      items: [
        {
          title: 'All Users',
          url: '/admin/user',
        },
        {
          title: 'Session',
          url: '/admin/user/sesion',
        },
      ],
    },
  ],
  // navTeam: [
  //   // {
  //   //   title: 'Team',
  //   //   url: ROUTES.ADMIN_TEAM,
  //   //   icon: ComponentsIcons.GroupIcon,
  //   //   items: [
  //   //     {
  //   //       title: 'All Team',
  //   //       url: ROUTES.ADMIN_TEAM,
  //   //     },
  //   //     {
  //   //       title: 'Create Team',
  //   //       url: '/admin/team/create-team',
  //   //     },
  //   //   ],
  //   // },
  // ],
  navService: [
    // {
    //   title: 'Project',
    //   url: '/admin/project',
    //   icon: ComponentsIcons.List,
    // },
    // {
    //   title: 'Type',
    //   url: ROUTES.ADMIN_TYPE,
    //   icon: ComponentsIcons.ClipboardList,
    // },
    {
      title: 'Report',
      url: '/admin/report',
      icon: ComponentsIcons.ClipboardList,
    },
    {
      title: 'Error',
      url: '/admin/error',
      icon: ComponentsIcons.ClipboardList,
    },
  ],
  navSupport: [
    {
      title: 'Tickets',
      url: ROUTES.ADMIN_TICKET,
      icon: ComponentsIcons.Bug,
    },
    {
      title: 'Audit Logs',
      url: ROUTES.ADMIN_AUDIT_LOG,
      icon: ComponentsIcons.Cog,
    },
  ],
};
