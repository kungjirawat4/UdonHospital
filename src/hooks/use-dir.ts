import { useLocale } from 'next-intl';
import { useMemo } from 'react';

import { dir } from '@/libs/dir';

export const useDir = () => {
  const locale = useLocale();
  return useMemo(() => dir(locale), [locale]);
};
