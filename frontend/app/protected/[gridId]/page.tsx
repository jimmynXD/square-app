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
import ClientTableWrapper, {
  WinnersTableWrapper,
} from './client-table-wrapper';
import ClientGrid from './client-grid';
import ClientWrapper from './client-wrapper';
import ActionButtonGroup from './action-buttons-group';

export default async function UserGridPage({
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

  await prefetchQuery(
    queryClient,
    GridAPI.v0.getWinners(supabase, params.gridId)
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
                <TabsTrigger value="winners">Winners</TabsTrigger>
              </TabsList>
              <ActionButtonGroup />
            </div>
            <TabsContent value="grid">
              <ClientGrid />
            </TabsContent>
            <TabsContent value="players">
              <ClientTableWrapper />
            </TabsContent>
            <TabsContent value="winners">
              <WinnersTableWrapper />
            </TabsContent>
          </Tabs>
        </ClientWrapper>
      </GridProvider>
    </HydrationBoundary>
  );
}
