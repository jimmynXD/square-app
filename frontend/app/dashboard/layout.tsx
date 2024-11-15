import { UserProvider } from '@/context/UserContext';
import { GridAPI } from '@/queries/grid.api';
import { getSupabaseServer } from '@/utils/supabase/server';
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const supabase = getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  await prefetchQuery(queryClient, GridAPI.v0.getManyGrids(supabase, user.id));
  await prefetchQuery(queryClient, GridAPI.v0.getUpcomingSchedules(supabase));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProvider userId={user.id}>{children}</UserProvider>
    </HydrationBoundary>
  );
}
