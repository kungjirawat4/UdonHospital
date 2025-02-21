'use client';

import type { UrlObject } from 'node:url';

import {
  Link,
  link as linkStyles,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Tooltip,
} from '@nextui-org/react';
import clsx from 'clsx';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';

import { CommandMenu } from '@/components/layouts/home-layout/command-menu';

import { siteConfig } from '@/settings/setting';
import { Notifications } from '@/components/layouts/medicine-layout/notifications';
import UserNav from '@/components/layouts/medicine-layout/userNav';

export default function Navbars() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    'Profile',
    'Dashboard',
    'Activity',
    'Analytics',
    'System',
    'Deployments',
    'My Settings',
    'Team Settings',
    'Help & Feedback',
    'Log Out',
  ];


  return (
    <Navbar maxWidth="xl" position="sticky" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="basis-1/5 lg:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="lg:hidden"
        />
        <NavbarBrand className="mr-4">
                <>
                  <Image
                    src="/images/logo_udh.png"
                    width={35}
                    height={35}
                    alt="Logo"
                    className="size-8"
                  />
                  <div className="whitespace-nowrap">ospital</div>
                </>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden w-full gap-4 lg:flex" justify="center">
       
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
        </NavbarItem>
        <NavbarItem>

          <div className="flex items-center gap-4">
            <Notifications />
            <UserNav />
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
