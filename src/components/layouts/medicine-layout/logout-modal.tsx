
'use client';

import { TriangleAlert } from 'lucide-react';
import useMediaQuery from '@/hooks/use-media-query';
import { Button } from '@/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/ui/drawer';
import { Link } from '@nextui-org/react';
import { FaPowerOff } from 'react-icons/fa6';
import useUserInfoStore from '@/zustand/userStore';

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const LogoutModal = ({ isOpen, onClose }: LogoutModalProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const onLogout = () => {
    useUserInfoStore.getState().logout()
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogTitle>คุณกำลังจะออกจากระบบ</DialogTitle>
          <div className="flex items-center gap-2 py-2">
            <TriangleAlert className="fill-yellow-600" size={32} />
            <span className="text-destructive">
            คุณแน่ใจว่าต้องการออกจากระบบบัญชีของคุณหรือไม่?
            </span>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button onClick={() => onLogout()}>ออกจากระบบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const closeDrawer = (v: boolean) => {
    if (!v) {
      onClose();
    }
  };

  return (
    <Drawer onOpenChange={closeDrawer} open={isOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>คุณกำลังจะออกจากระบบ</DrawerTitle>
        </DrawerHeader>
        <div className="flex items-center justify-center gap-2 p-4 sm:justify-start">
          <TriangleAlert className="fill-yellow-600" size={36} />
          <span className="text-destructive">
          คุณแน่ใจว่าต้องการออกจากระบบบัญชีของคุณหรือไม่?
          </span>
        </div>
        <DrawerFooter>
          <Button variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={() => onLogout()}>ออกจากระบบ</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
