import { GridProvider } from '@/context/GridContext';
import { GridAPI } from '@/queries/grid.api';
import { useSupabaseServer } from '@/utils/supabase/server';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientTableWrapper from './client-table-wrapper';
import ClientGrid from './client-grid';
import UpdateCellDrawer from './update-cell-drawer';
import ClientWrapper from './client-wrapper';

export default async function GridPage({
  params,
}: {
  params: { gridId: string };
}) {
  const queryClient = new QueryClient();

  const supabase = useSupabaseServer();

  await prefetchQuery(queryClient, GridAPI.v0.getGrid(supabase, params.gridId));

  await prefetchQuery(
    queryClient,
    GridAPI.v0.getManyCells(supabase, params.gridId)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GridProvider gridId={params.gridId}>
        <ClientWrapper>
          <Tabs defaultValue="grid" className="space-y-4">
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
              </TabsList>
              <UpdateCellDrawer />
            </div>
            <TabsContent value="grid">
              <ClientGrid />
            </TabsContent>
            <TabsContent value="players">
              <ClientTableWrapper />
            </TabsContent>
          </Tabs>
        </ClientWrapper>
      </GridProvider>
    </HydrationBoundary>
  );
}
