'use server';

import { encodedRedirect } from '@/utils/utils';
import { getSupabaseServer } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signUpAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = getSupabaseServer();
  const origin = headers().get('origin');
  const forwardedHost = headers().get('x-forwarded-host');
  const redirectUrl =
    process.env.NODE_ENV === 'production' && forwardedHost
      ? `https://${forwardedHost}/auth/callback`
      : `${origin}/auth/callback`;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return encodedRedirect('error', '/sign-up', error.message);
  } else {
    return encodedRedirect(
      'success',
      '/sign-up',
      'Thanks for signing up! Please check your email for a verification link.'
    );
  }
};

export const signInWithGoogleAction = async () => {
  const supabase = getSupabaseServer();
  const origin = headers().get('origin');
  const forwardedHost = headers().get('x-forwarded-host');
  const redirectUrl =
    process.env.NODE_ENV === 'production' && forwardedHost
      ? `https://${forwardedHost}/auth/callback`
      : `${origin}/auth/callback`;

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.log(error);
  } else {
    return redirect(data.url);
  }
};

export const signInWithEmailAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await getSupabaseServer();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/sign-in', error.message);
  }

  return redirect('/dashboard');
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = getSupabaseServer();
  const origin = headers().get('origin');
  const forwardedHost = headers().get('x-forwarded-host');
  const redirectUrl =
    process.env.NODE_ENV === 'production' && forwardedHost
      ? `https://${forwardedHost}/auth/callback`
      : `${origin}/auth/callback`;

  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return encodedRedirect('error', '/forgot-password', 'Email is required');
  }
  console.log(email, '\n', redirectUrl);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl + '?callbackUrl=/dashboard/reset-password',
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      'error',
      '/forgot-password',
      'Could not reset password'
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    'success',
    '/forgot-password',
    'Check your email for a link to reset your password.'
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = getSupabaseServer();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Password and confirm password are required'
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Passwords do not match'
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      'error',
      '/dashboard/reset-password',
      'Password update failed'
    );
  }

  encodedRedirect('success', '/dashboard/reset-password', 'Password updated');
};

export const signOutAction = async () => {
  const supabase = getSupabaseServer();
  await supabase.auth.signOut();
  return redirect('/');
};
