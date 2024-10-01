'use client';
import { useGridContext } from '@/context/GridContext';
import { formattedDate } from '@/utils/utils';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gridInfo } = useGridContext();
  return (
    <div className="flex-1 space-y-4 xl:max-w-7xl xl:mx-auto p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{gridInfo?.name}</h2>
      </div>
      <p className="text-sm text-gray-500">
        {gridInfo?.nfl_schedule?.short_name || ''} |{' '}
        {formattedDate(new Date(gridInfo?.nfl_schedule?.date || ''))}
      </p>
      {children}
    </div>
  );
}
