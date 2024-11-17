'use client';
import {
  FormMessage as SecondaryformMessage,
  Message,
} from '@/components/form-message';

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
};

export default function AuthForm({
  title,
  description,
  message,
  children,
}: AuthFormProps) {
  return (
    <Card className="border-none shadow-none w-full md:w-[400px]">
      <CardHeader className="px-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <SecondaryformMessage message={message} />

      <CardContent>{children}</CardContent>
    </Card>
  );
}
