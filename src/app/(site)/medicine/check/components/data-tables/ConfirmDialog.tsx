import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Table');
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('del_alert_title')}</AlertDialogTitle>
        <AlertDialogDescription>
          {message || t('del_alert_message')}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{t('del_alert_cancel')}</AlertDialogCancel>
        <AlertDialogAction onClick={onClick}>
          {t('del_alert_continue')}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
