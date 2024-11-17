'use client';
import { signInWithEmailAction } from '@/app/actions';
import { Message } from '@/components/form-message';
import { Input, ClientInputPassword } from '@/components/ui/input';

import Link from 'next/link';

import AuthForm from '../_components/AuthForm';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

export default function SignInPage({
  searchParams,
}: {
  searchParams: Message;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    await signInWithEmailAction(formData);
  };

  return (
    <AuthForm
      title="Welcome Back"
      description={
        <>
          Don&apos;t have an account?{' '}
          <Link className="text-primary font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </>
      }
      message={searchParams}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <Link
                    className="text-xs text-foreground underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <ClientInputPassword {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
}
