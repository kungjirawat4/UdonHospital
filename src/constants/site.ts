export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + NextUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/medicine',
      image: 'http://localhost:3000/images/house.png',
    },
    {
      label: 'Prescription',
      href: '/medicine/prescription',
      image: 'http://localhost:3000/images/prescription.png',
    },
    {
      label: 'Screening',
      href: '/medicine/screening',
      image: 'http://localhost:3000/images/screening01.png',
    },
    {
      label: 'Matching Basket',
      href: '/medicine/matching',
      image: 'http://localhost:3000/images/autoload.png',
    },
    {
      label: 'Drug Station',
      href: '/medicine/station',
      image: 'http://localhost:3000/images/cabinet.png',
    },
    {
      label: 'Double check',
      href: '/medicine/check',
      image: 'http://localhost:3000/images/drug_check.png',
    },
    {
      label: 'Queue Receive',
      href: '/medicine/queue',
      image: 'http://localhost:3000/images/call_q.png',
    },
  ],
  navMenuItems: [
    {
      label: 'Profile',
      href: '/profile',
      image: 'images/screening.png',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      image: 'images/screening.png',
    },
    {
      label: 'Projects',
      href: '/projects',
      image: 'images/screening.png',
    },
    {
      label: 'Team',
      href: '/team',
      image: 'images/screening.png',
    },
    {
      label: 'Calendar',
      href: '/calendar',
      image: 'images/screening.png',
    },
    {
      label: 'Settings',
      href: '/settings',
      image: 'images/screening.png',
    },
    {
      label: 'Help & Feedback',
      href: '/help-feedback',
      image: 'images/screening.png',
    },
    {
      label: 'Logout',
      href: '/logout',
      image: 'images/screening.png',
    },
  ],
  links: {
    github: 'https://github.com/nextui-org/nextui',
    twitter: 'https://twitter.com/getnextui',
    docs: 'https://nextui.org',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};

// export const siteConfig = {
//   name: 'Pexlle',
//   url: 'https://pexlle.com',
//   ogImage: 'https://ui.shadcn.com/og.jpg',
//   description:
//     'Beautifully designed components built with Radix UI and Tailwind CSS.',
//   links: {
//     twitter: 'https://twitter.com/khaledlkurdi',
//     github: 'https://github.com/khaledlkurdi',
//   },
// };

// export type SiteConfig = typeof siteConfig;
