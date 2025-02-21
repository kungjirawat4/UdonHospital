'use client';

import { ScrollShadow } from '@nextui-org/react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import Sidebar from './sidebar';

export default function Example({ children }: { children: React.ReactNode }) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25}>
        <ScrollShadow className="size-full">
          <Sidebar />
        </ScrollShadow>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full justify-center p-6">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
