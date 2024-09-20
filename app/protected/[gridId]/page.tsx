import ClientGrid from '@/components/ClientGrid';
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
import ClientWrapper from '@/components/ClientWrapper';

export default async function GridPage({
  params,
}: {
  params: { gridId: string };
}) {
  const queryClient = new QueryClient();

  const supabase = useSupabaseServer();

  await prefetchQuery(
    queryClient,
    GridAPI.getGridCells(supabase, params.gridId)
  );

  await prefetchQuery(
    queryClient,
    GridAPI.getGridInfo(supabase, params.gridId)
  );

  await prefetchQuery(
    queryClient,
    GridAPI.getGridRowAssignments(supabase, params.gridId)
  );

  await prefetchQuery(
    queryClient,
    GridAPI.getGridColAssignments(supabase, params.gridId)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GridProvider gridId={params.gridId}>
        <ClientWrapper gridId={params.gridId}>
          <Tabs defaultValue="grid" className="space-y-4">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="players">Players</TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
              <ClientGrid />
            </TabsContent>
            <TabsContent value="players">Table of players</TabsContent>
          </Tabs>
        </ClientWrapper>
      </GridProvider>
    </HydrationBoundary>
  );
}
