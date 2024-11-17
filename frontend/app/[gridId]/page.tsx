import { GridAPI } from '@/queries/grid.api';
import { getSupabaseServer } from '@/utils/supabase/server';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import ClientGrid from './client-grid';

export default async function GridPage({
  params,
}: {
  params: { gridId: string };
}) {
  const queryClient = new QueryClient();

  const supabase = getSupabaseServer();

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
      <ClientGrid className="pt-24" gridId={params.gridId} />
    </HydrationBoundary>
  );
}
