'use client';

import { DialogProps, DialogTitle } from '@radix-ui/react-dialog';
import {
  FaBookmark,
  FaCircle,
  FaFile,
  FaLaptop,
  FaMoon,
  FaSun,
} from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { docsConfig } from '@/settings/docs';
import { menuConfigs } from '@/settings/menu';
import { cn } from '@/libs/utils';
import { Button } from '@/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/ui/command';

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-8 w-full justify-start text-sm text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64',
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">ค้นหา...</span>
        <span className="inline-flex lg:hidden">ค้นหา...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>
          K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle />
        <CommandInput placeholder="พิมพ์คำสั่งหรือค้นหา..." />
        <CommandList>
          <CommandEmpty>ไม่พบข้อมูล.</CommandEmpty>
          <CommandGroup>
            {menuConfigs.mainNav
              .filter(navitem => !navitem.external)
              .map(navItem => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <FaBookmark className="mr-2 size-4" />
                  {navItem.title}
                </CommandItem>
              ))}
          </CommandGroup>
          {/* {docsConfig.sidebarNav.map(group => (
            <CommandGroup key={group?.title} heading={group.title}>
              {group.items.map((navItem: NavItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <div className="mr-2 flex size-4 items-center justify-center">
                    <FaCircle className="size-3" />
                  </div>
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))} */}
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
