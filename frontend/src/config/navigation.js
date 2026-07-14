import {
  Presentation,
  LayoutDashboard,
  GraduationCap,
  Wallet,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  UserRound,
} from 'lucide-react';

export const navByRole = {
  superadmin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/superadmin/dashboard' },
    { label: 'Schools', icon: GraduationCap, path: '/superadmin/schools' },
    { label: 'Financial', icon: Wallet, path: '/superadmin/financial' },
    { label: 'Users', icon: Users, path: '/superadmin/users' },
    { label: 'Settings', icon: Settings, path: '/superadmin/settings' },
  ],
  schooladmin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Teachers', icon: UserRound, path: '/admin/teachers' },
    { label: 'Students', icon: UserRound , path: '/teacher/students' },
    { label: 'Academic', icon: GraduationCap, path: '/admin/academic' },
    { label: 'Financial', icon: Wallet, path: '/admin/financial' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Attendance', icon: CalendarCheck, path: '/admin/attendance' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  teacher: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
    { label: 'Academic', icon: GraduationCap, path: '/teacher/academic' },
    { label: 'Students', icon:UserRound , path: '/teacher/students' },
    { label: 'Attendance', icon: CalendarCheck, path: '/teacher/attendance' },
    { label: 'Results', icon: BarChart3, path: '/teacher/results' },
    { label: 'Settings', icon: Settings, path: '/teacher/settings' },
  ],
  parent: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/parent/dashboard' },
    { label: 'Attendance', icon: CalendarCheck, path: '/parent/attendance' },
    { label: 'Results', icon: BarChart3, path: '/parent/results' },
    { label: 'Financial', icon: Wallet, path: '/parent/financial' },
    { label: 'Settings', icon: Settings, path: '/parent/settings' },
  ],
};

export const roleLabel = {
  superadmin: 'System Overseer',
  schooladmin: 'School Admin',
  teacher: 'Senior Faculty',
  parent: 'Parent',
  student: 'Student',
};