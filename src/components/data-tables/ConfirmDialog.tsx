// import { useTranslations } from 'next-intl';

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog';

export default function ConfirmDialog({
  onClick,
  message,
}: {
  onClick: any;
  message?: string;
}) {
  // const t = useTranslations('Table');
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{'คุณแน่ใจแน่นอนมั้ย?'}</AlertDialogTitle>
        <AlertDialogDescription>
          {message || 'การดำเนินการนี้ไม่สามารถย้อนกลับได้ การดำเนินการนี้จะลบข้อมูลของคุณออกจากฐานข้อมูลอย่างถาวร'}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{'ยกเลิก'}</AlertDialogCancel>
        <AlertDialogAction onClick={onClick}>
          {'ตกลง'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
