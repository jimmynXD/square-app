import CreateGridSheet from './create-grid-sheet';
import GridDataTable from './grid-data-table';

export default async function ProtectedPage() {
  return (
    <div className="flex flex-col flex-grow mx-auto px-4 pt-24 pb-4">
      <h1 className="text-2xl font-bold mb-4">Your Grids</h1>
      <div className="mb-4">
        <CreateGridSheet />
      </div>
      <GridDataTable />
    </div>
  );
}
