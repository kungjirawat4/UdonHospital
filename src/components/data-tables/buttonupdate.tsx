import { Button } from '@nextui-org/react';

import useToasts from '@/hooks/use-toasts';
// import useApi from '@/hooks/useApi';
import ApiCall from '@/services/api';

type ButtonUpdateProps = {
  data: any; // Data from the row
};

export default function ButtonUpdate({ data }: ButtonUpdateProps) {
  const updateApi = ApiCall({
    key: ['prescription'],
    method: 'PUT',
    url: `medicine/drug`,
  })?.put;
  const { toastSuccess, toastWarning } = useToasts();
  const handleClick = async () => {
    try {
      await updateApi?.mutateAsync({
        id: data?.code?.trim(),
        name: data?.gen_name?.trim(),
        medicineName_th: data?.thai_name?.trim(),
        medicineName_en: data?.name?.trim(),
        medicinePackageSize: data?.package?.trim(),
      });
      toastSuccess('อัพเดทยาสำเร็จ');
      // console.log('Update successful:', data);
    } catch {
      toastWarning('เกิดข้อผิดพลาดในการอัพเดท');
    };
  };
  return (
    <Button color="primary" onClick={handleClick} disabled={updateApi?.isPending}>
      {/* Update */}
      {updateApi?.isPending ? 'Loading...' : 'Update'}
    </Button>
  );
}
