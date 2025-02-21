import { Shell } from '../common/shell';
import { DataTableLoading } from './data-table-skeleton';

export default function TableLoading() {
  return (
    <Shell>
      <DataTableLoading columnCount={5} />
    </Shell>
  );
}
