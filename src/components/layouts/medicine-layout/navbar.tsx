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

import { Notifications } from './notifications';
import UserNav from './userNav';
import { siteConfig } from '@/settings/setting';
import ThemeSwitcher from '@/components/theme/page';
import dynamic from 'next/dynamic';

export default function Navbars() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
const LogoutModal = dynamic(() => import('./logout-modal').then(mod => mod.LogoutModal), {
  ssr: false,
});
  const menuItems = [
    {
      label: 'หน้าหลัก',
      href: '/medicine',
      image: 'http://localhost:3000/images/house.png',
    },
    {
      label: 'ใบสั่งยา',
      href: '/medicine/prescription',
      image: 'http://localhost:3000/images/prescription.png',
    },
    {
      label: 'การคัดกรอง',
      href: '/medicine/screening',
      image: 'http://localhost:3000/images/screening01.png',
    },
    {
      label: 'จับคู่ตะกร้า',
      href: '/medicine/matching',
      image: 'http://localhost:3000/images/autoload.png',
    },
    {
      label: 'สถานียา',
      href: '/medicine/station',
      image: 'http://localhost:3000/images/cabinet.png',
    },
    {
      label: 'ตรวจสอบ',
      href: '/medicine/check',
      image: 'http://localhost:3000/images/drug_check.png',
    },
    {
      label: 'การรับคิว',
      href: '/medicine/queue',
      image: 'http://localhost:3000/images/call_q.png',
    },
    {
      label: 'ใบเช็คข้อมูล',
      href: '/medicine/list',
      image: 'http://localhost:3000/images/call_q.png',
    },
    {
      label: 'ออกจากระบบ',
      href: '/auth/logout',
      image: 'http://localhost:3000/images/call_q.png',
    },
  ]

  return (
    <Navbar maxWidth="xl" position="sticky" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="basis-1/5 md:basis-full" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden"
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

      <NavbarContent className="hidden w-full gap-4 md:flex" justify="center">
        <ul className="flex space-x-9 md:flex">
          {siteConfig.navItems.map(
            (item: {
              href: string | UrlObject;
              label: string;
              image: string;
            }) => (
              <NavbarItem key={item.href as string}>
                <Tooltip
                  showArrow
                  content={(
                    <div className="px-1 py-2">
                      <div className="text-small font-bold">
                        {item.label as string}
                      </div>
                    </div>
                  )}
                >
                  <NextLink
                    className={clsx(
                      linkStyles({ color: 'foreground' }),
                      'data-[active=true]:font-medium data-[active=true]:text-primary',
                    )}
                    color="foreground"
                    href={item.href}
                  >
                    <Image
                      src={item.image}
                      className="size-8"
                      width={35}
                      height={35}
                      alt={item.label as string}
                    />
                    {/* {item.label} */}
                  </NextLink>
                </Tooltip>
              </NavbarItem>
            ),
          )}
        </ul>
      </NavbarContent>
      <NavbarContent justify="end">
      <NavbarItem>
          <div className="flex items-center gap-4">
          <ThemeSwitcher />
          </div>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <div className="flex items-center gap-2">
            <CommandMenu />
          </div>
        </NavbarItem>
        <NavbarItem>
          <div className="flex items-center gap-4">
            <Notifications />
            <UserNav />
          </div>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        <CommandMenu />
        {menuItems.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={

                index === 2
                  ? 'primary'
                  : index === menuItems.length - 1
                    ? 'danger'
                    : 'foreground'
              }
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
