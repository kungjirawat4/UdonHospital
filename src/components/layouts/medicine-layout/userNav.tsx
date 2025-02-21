
/* eslint-disable style/multiline-ternary */
'use client';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import {
  User
} from '@nextui-org/user';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';


import { NextLink } from '@/components/common/link';

import { DarkModeSwitch } from './darkswitch';
import useUserInfoStore from '@/zustand/userStore';
import { AddNoteIcon } from '@/components/common/icons';

const LogoutModal = dynamic(() => import('./logout-modal').then(mod => mod.LogoutModal), {
  ssr: false,
});

export default function UserNav() {
  const { userInfo } = useUserInfoStore((state) => state)
  const [menu, setMenu] = React.useState<any>(userInfo.menu)

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  React.useEffect(() => {
    const label = document.querySelector(`[data-drawer-target="bars"]`)
    if (userInfo.id) {
      setMenu(userInfo.menu)
      label?.classList.remove('hidden')
    } else {
      label?.classList.add('hidden')
    }
  }, [userInfo])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }


  const iconClasses = 'text-xl text-default-500 pointer-events-none flex-shrink-0';
  return (
    <>
      <LogoutModal
        onClose={() => setLogoutModalOpen(false)}
        isOpen={isLogoutModalOpen}
      />
      {userInfo
        ? (
          <Dropdown
            backdrop="blur"
            showArrow
          >
            <DropdownTrigger>
              <User
                as="button"
                avatarProps={{
                  isBordered: true,
                  src: userInfo.image as string,
                  size: 'sm',
                }}
                className="transition-transform"
                description={userInfo.role}
                name={userInfo.name}
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Custom item styles"
              disabledKeys={['profile']}
              className="p-3"
              itemClasses={{
                base: [
                  'rounded-md',
                  'text-default-500',
                  'transition-opacity',
                  'data-[hover=true]:text-foreground',
                  'data-[hover=true]:bg-default-100',
                  'dark:data-[hover=true]:bg-default-50',
                  'data-[selectable=true]:focus:bg-default-50',
                  'data-[pressed=true]:opacity-70',
                  'data-[focus-visible=true]:ring-default-500',
                ],
              }}
            >
              <DropdownSection aria-label="Profile & Actions" showDivider>
                <DropdownItem
                  isReadOnly
                  key="user"
                  className="h-14 gap-2 opacity-100"
                >
                  <User
                    name={userInfo.name}
                    description={userInfo.role}
                    classNames={{
                      name: 'text-default-600',
                      description: 'text-default-500',
                    }}
                    avatarProps={{
                      size: 'sm',
                      src: userInfo.image,
                    }}
                  />
                </DropdownItem>
                <DropdownItem key={''}>
                  <div className="flex flex-col">
                    <NextLink
                      href="/account/profile"
                      className="flex justify-between"
                    >
                      <div className="mb-1 text-sm leading-none">โปรไฟล์</div>
                    </NextLink>
                    <div className="text-xs text-muted-foreground">
                      {userInfo.email}
                    </div>
                  </div>
                </DropdownItem>
                {menu[0]?.children.map((item: any) => (
                  <DropdownItem
                    key={item.name}
                    // shortcut="⌘N"
                    // description="Create a new file"
                    startContent={<AddNoteIcon className={iconClasses} />}
                  >
                    <NextLink
                      href={`${item.path}`}
                      className="flex justify-between"
                    >
                      {item.name}
                    </NextLink>

                  </DropdownItem>
                ))}

                {/*  <DropdownItem
                    key="edit"
                    shortcut="⌘⇧E"
                    description="Allows you to edit the file"
                    startContent={<EditDocumentIcon className={iconClasses} />}
                  >
                    Edit file
                  </DropdownItem> */}

              </DropdownSection>
              {/* <DropdownSection title="Danger zone"> */}

                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  // shortcut="⌘⇧O"
                  // description="Log out now"
                  onClick={() => setLogoutModalOpen(true)}
                // startContent={
                //   <DeleteDocumentIcon className={cn(iconClasses, 'text-danger')} />
                // }
                >
                  ออกจากระบบ
                </DropdownItem>
              {/* </DropdownSection> */}
              {/* <DropdownItem key="switch">
                <DarkModeSwitch />
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        )
        : (
          <p>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        )}
    </>
  );
}
