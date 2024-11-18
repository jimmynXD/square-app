'use client';
import { signInWithGoogleAction } from '@/app/actions';
import {
  FormMessage as SecondaryformMessage,
  Message,
} from '@/components/form-message';
import { GoogleSignInStandaloneButton } from '@/components/GoogleSignInButton';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ReactNode } from 'react';

export type AuthFormProps = {
  title: string;
  description?: ReactNode;
  message: Message;
  children: ReactNode;
  googleSignIn?: boolean;
};

export default function AuthForm({
  title,
  description,
  message,
  children,
  googleSignIn = false,
}: AuthFormProps) {
  return (
    <Card className="border-none shadow-none w-full md:w-[400px]">
      <CardHeader className="px-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <SecondaryformMessage message={message} />
      {googleSignIn && (
        <div className="mb-4 space-y-4">
          <GoogleSignInStandaloneButton
            onClick={async () => await signInWithGoogleAction()}
          >
            Continue with Google
          </GoogleSignInStandaloneButton>
          <div className="relative after:content-['']  after:absolute after:h-[1px] after:bg-border after:left-0 after:right-0 after:top-1/2 after:-translate-y-1/2 flex justify-center items-center">
            <span className="z-10 bg-background px-2 text-sm">or</span>
          </div>
        </div>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
