const config: any = {
  id: 'cm1xf3fj7000014a6175sfnv5',
  hospital_code: '001',
  hospital_initial: 'UDH',
  hospital_nameTH: 'โรงพยาบาลอุดรธานี',
  hospital_nameEN: 'Udon Thani Hospital',
  hospital_logo: 'http://localhost:3000/assets/upload/logo-logo-logo_udh-1728462652494-1728472094996.png',
  hosptal_station: '0',
  hosptal_status: true,
  hospital_queue_day: 1,
};

const roles: any[] = [
  {
    id: 'HzdmUa40IctkReRd2Pofm',
    name: 'Super Admin',
    description:
      'Super Admins can access and manage all features and settings.',
    type: 'SUPER_ADMIN',
  },
  {
    id: 'a75POUlJzMDmaJtz0JCxp',
    name: 'Authenticated',
    description: 'Default role given to authenticated user.',
    type: 'AUTHENTICATED',
  },
];

const users: any = {
  id: 'cm1xgfwiz000cevie0jier93b',
  name: 'Admin',
  email: 'info@admin.com',
  password: '123456',
  confirmed: true,
  blocked: false,
  mobile: '0812811002',
  address: 'Krabi',
  image: 'http://localhost:3000/assets/upload/undefined-11622886-1729399527825.jpeg',
  bio: 'Full Stack Developer',
};

const profile: any = {
  id: 'hMXCyzI2MLXNI6tQ-sU0i',
  mobile: 812811002,
  address: 'krabi',
  image: 'https://github.com/noppadech.png',
  bio: 'Full Stack Developer',
};

const sort = {
  hidden: 0,
  profile: 1,
  admin: 2,
};

const clientPermissions: any[] = [
  {
    id: 'MZ4Qsx2e-g96eMw0X2qul',
    name: 'Home',
    path: '/',
    menu: 'hidden',
    sort: sort.hidden,
    description: 'Home page',
  },
  {
    id: 'IYN1EVSvUg0o5pAxgPEPi',
    name: 'Users',
    path: '/admin/users',
    menu: 'admin',
    sort: sort.admin,
    description: 'Users page',
  },
  {
    id: 'VFGo5W_hc3O85QCOouabO',
    name: 'Roles',
    path: '/admin/roles',
    menu: 'admin',
    sort: sort.admin,
    description: 'Roles page',
  },
  {
    id: 't-Snd86AW-TlIlMEDmYyt',
    name: 'Profile',
    path: '/account/profile',
    menu: 'profile',
    sort: sort.profile,
    description: 'Profile page',
  },
  {
    id: 'eWpbNJ9LkTVO4BYyaO1mJ',
    name: 'Permissions',
    path: '/admin/permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGaOC2',
    name: 'Client Permissions',
    path: '/admin/client-permissions',
    menu: 'admin',
    sort: sort.admin,
    description: 'Client Permissions page',
  },
  {
    id: 'HnCMgsT54kcTRYlJGsOC2',
    name: 'Database',
    path: '/admin/database',
    menu: 'admin',
    sort: sort.admin,
    description: 'Database page',
  },
];

const permissions: any[] = [
  // Users
  {
    id: 'fCuAED2qkbOmWYmKsOa-_',
    description: 'Users',
    route: '/api/users',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'UzN2L6RQ_gUM0_JN4ALkB',
    description: 'User Client Permissions',
    route: '/api/users/:id',
    name: 'Users',
    method: 'GET',
  },
  {
    id: 'rqRYCpC0yytkColvHwY3C',
    description: 'User',
    route: '/api/users',
    name: 'Users',
    method: 'POST',
  },
  {
    id: 'xsei4vGvYpoXw3V0_Bgcy',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'PUT',
  },
  {
    id: '27vMGpNbQGLKtuaIsTAcF',
    description: 'User',
    route: '/api/users/:id',
    name: 'Users',
    method: 'DELETE',
  },

  //   Profile
  {
    id: 'Fyph8SxjGayAHr8g65Rie',
    description: 'Profile',
    route: '/api/profile',
    name: 'Profile',
    method: 'GET',
  },
  {
    id: 'LMG211l6gxRRkjAHPvhgw',
    description: 'Profile',
    route: '/api/profile/:id',
    name: 'Profile',
    method: 'PUT',
  },

  //   Role
  {
    id: '2xiakJtuDptmlP7fxgggo',
    description: 'Roles',
    route: '/api/roles',
    name: 'Roles',
    method: 'GET',
  },
  {
    id: 'HQ8Drbd0-KOMequqhQVuG',
    description: 'Role',
    route: '/api/roles',
    name: 'Roles',
    method: 'POST',
  },
  {
    id: 'GzrnbouFYGvGfvdAfbiZT',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'PUT',
  },
  {
    id: 'KrZ76u2VUI9qICSJhsuW5',
    description: 'Role',
    route: '/api/roles/:id',
    name: 'Roles',
    method: 'DELETE',
  },

  //   Permission
  {
    id: '9P0mpbew9dYW4oF9cM-mO',
    description: 'Permissions',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'GET',
  },
  {
    id: 'n0dw4GMpgiXfySbdlGhs0',
    description: 'Permission',
    route: '/api/permissions',
    name: 'Permissions',
    method: 'POST',
  },
  {
    id: 'tK5RgtYLe9yFNgF93m6TO',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'PUT',
  },
  {
    id: 'cn25W3-inLybNRkCMHgNC',
    description: 'Permission',
    route: '/api/permissions/:id',
    name: 'Permissions',
    method: 'DELETE',
  },

  //   Client Permission
  {
    id: 'X26iEN1J-LBaC4HlPsRgh',
    description: 'Client Permissions',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'GET',
  },
  {
    id: 'HRu69jNp0j4pJXs_cjCQ5',
    description: 'Client Permission',
    route: '/api/client-permissions',
    name: 'ClientPermissions',
    method: 'POST',
  },
  {
    id: 'X9ACZfrFX9CAl-2uPXyw9',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'PUT',
  },
  {
    id: 'YTU-o6vjJk4A-4uM8kgxA',
    description: 'Client Permission',
    route: '/api/client-permissions/:id',
    name: 'ClientPermissions',
    method: 'DELETE',
  },
  //  Upload
  {
    id: 'YTU-o6vjJk4A-4uM8kgxM',
    description: 'Upload',
    route: '/api/uploads',
    name: 'Upload',
    method: 'POST',
  },
  //   Database
  {
    id: 'X26iEN1a-LBaC4HlPsRgh',
    description: 'Download database',
    route: '/api/databases/download',
    name: 'Database',
    method: 'POST',
  },
  {
    id: 'X26iEN1a-LBaC4HlPPRgh',
    description: 'Get databases',
    route: '/api/databases',
    name: 'Database',
    method: 'GET',
  },
  {
    id: 'HRu69jNpsj4pJXs_cjCQ5',
    description: 'Database',
    route: '/api/databases/backup',
    name: 'Backup database',
    method: 'POST',
  },
];

export { clientPermissions, config, permissions, profile, roles, users };

export type Person = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
};

export const PEOPLE: Person[] = [
  {
    id: '1',
    name: 'Marie the Chef',
    role: 'Culinary Expert',
    description:
      'Marie shares her decades of experience in culinary arts, offering recipes and cooking tips to elevate your home dining experience.',
    image:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
  },
  {
    id: '2',
    name: 'Carlos Gardener',
    role: 'Gardening Enthusiast',
    description:
      'Carlos brings greenery into your life with gardening tips, plant care advice, and landscape design ideas.',
    image:
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
  },
  {
    id: '3',
    name: 'Emma Photographer',
    role: 'Professional Photographer',
    description:
      'Explore the art of photography with Emma as she delves into techniques for capturing the perfect shot.',
    image:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
  },
  {
    id: '4',
    name: 'Dave Cyclist',
    role: 'Adventure Cyclist',
    description:
      'Join Dave on breathtaking cycling adventures across mountains and through rural landscapes.',
    image:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
  },
  {
    id: '5',
    name: 'Lily Potter',
    role: 'Pottery Artist',
    description:
      'Lily teaches the joy of pottery making, from the wheel to the kiln. Discover how to make beautiful and functional art.',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
  },
  {
    id: '6',
    name: 'Sophie Yoga Instructor',
    role: 'Yoga Teacher',
    description:
      'Sophie helps you align your body and mind with yoga practices suitable for all levels.',
    image:
      'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
  },
];

export function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
  return initials;
}
