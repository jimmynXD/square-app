import CreateGridSheet from './create-grid-sheet';
import GridDataTable from './grid-data-table';

export default async function ProtectedPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Grids</h1>
      <div className="mb-4">
        <CreateGridSheet />
      </div>
      <GridDataTable />
    </div>
  );
}
