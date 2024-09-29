import { UserProvider } from '@/context/UserContext';
import { GridAPI } from '@/queries/grid.api';
import { useSupabaseServer } from '@/utils/supabase/server';
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

  const supabase = useSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  await prefetchQuery(queryClient, GridAPI.getAll(supabase, user.id));
  await prefetchQuery(queryClient, GridAPI.getSchedule(supabase));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserProvider userId={user.id}>{children}</UserProvider>
    </HydrationBoundary>
  );
}
