'use client';
import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/libs/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip';

import { CommandMenu } from './command-menu';
import { siteConfig } from '@/settings/setting';

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [logo, setLogo] = React.useState('/images/pexlleh.svg'); // Initialize logo state with dark logo

  React.useEffect(() => {
    // Assuming the 'system' theme aligns with light mode
    const effectiveTheme = theme === 'system' ? 'light' : theme;

    if (effectiveTheme === 'light') {
      setLogo('/images/pexlleh.svg'); // Path for the light theme logo
    } else {
      setLogo('/images/pexllelight.png'); // Path for the dark theme logo
    }
  }, [theme]);

  return (
    <div className="supports-backdrop-blur:bg-background/50 fixed inset-x-0 top-0 z-20 border-b border-muted/20 bg-background/20 backdrop-blur sm:px-0 xl:px-9">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className={cn('block sm:!hidden')}>
          {/* <MainSidebar /> */}
        </div>
        <div className="">
          {/* Use the logo state for rendering */}
          <Link href="/">
            <Image src={logo} alt="Pexlle Logo" width={150} height={50} />
            {' '}
            {/* Adjust width and height as needed */}
          </Link>
        </div>

        <div className="flex justify-center sm:block">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60',
              )}
            >

            </Link>
            <Link
              href="#"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith('/docs/components') ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              Components
            </Link>
            <Link
              href="#"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith('/themes') ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              Themes
            </Link>
            <Link
              href="#"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith('/examples') ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              Examples
            </Link>
            <Link
              href="#"
              className={cn(
                'hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block',
              )}
            >
              GitHub
            </Link>
          </nav>
        </div>

        <div className="hidden justify-center md:flex">
          <CommandMenu />

          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <div className="flex size-9 items-center justify-center">
              {/* <Icons.gitHub className="size-4" /> */}
              <span className="sr-only">GitHub</span>
            </div>
          </Link>

          <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
            <div className="flex size-9 items-center justify-center">
              {/* <Icons.twitter className="size-3 fill-current" /> */}
              <span className="sr-only">Twitter</span>
            </div>
          </Link>

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex size-9 items-center justify-center"
                >
                  <Sun
                    className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    onClick={() => setTheme('dark')}
                    strokeWidth={1}
                  />
                  <Moon
                    className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    onClick={() => setTheme('light')}
                    strokeWidth={1}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Light/Dark</TooltipContent>
            </Tooltip>
            {/* <LangSwitcher locale={locale} /> */}
          </TooltipProvider>
        </div>
      </nav>
    </div>
  );
}
