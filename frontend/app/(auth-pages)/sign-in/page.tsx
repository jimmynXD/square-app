import { signInAction } from '@/app/actions';
// import GoogleSignInButton from '@/components/GoogleSignInButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren } from 'lucide-react';

export default function Login({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      {searchParams.error && (
        <Alert>
          <Siren className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {searchParams.error === 'access_denied'
              ? 'Sign in was cancelled'
              : searchParams.error}
          </AlertDescription>
        </Alert>
      )}

      <form action={signInAction} className="">
        <p>Coming soon...</p>
        {/* <GoogleSignInButton /> */}
      </form>
    </div>
  );
}
