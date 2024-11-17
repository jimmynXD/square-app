import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const next = searchParams.get('next') ?? '/';
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const callbackUrl = searchParams.get('callbackUrl')?.toString();

  // Handle error case (like when user cancels the sign-in)
  if (error) {
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}/sign-in?error=${error}`);
    } else {
      return NextResponse.redirect(
        `https://${forwardedHost}/sign-in?error=${error}`
      );
    }
  }

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectPath = callbackUrl || next;

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}/sign-in?error=Unable to sign in`);
  } else {
    return NextResponse.redirect(
      `https://${forwardedHost}/sign-in?error=Unable to sign in`
    );
  }
}
