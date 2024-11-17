'use client';
import { forgotPasswordAction } from '@/app/actions';
import { Message } from '@/components/form-message';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthForm from '../_components/AuthForm';
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
});

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('email', values.email);

    await forgotPasswordAction(formData);
  };
  return (
    <AuthForm
      title="Forgot Password"
      description={
        <>
          Already have an account?{' '}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
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
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </AuthForm>
    // <Card className="border-none shadow-none w-full md:w-[400px]">
    //   <CardHeader className="px-4">
    //     <CardTitle>Forgot Password</CardTitle>
    //     <CardDescription>
    //       Already have an account?{' '}
    //       <Link className="text-primary underline" href="/sign-in">
    //         Sign in
    //       </Link>
    //     </CardDescription>
    //   </CardHeader>
    //   <FormMessage message={searchParams} />
    //   <CardContent>
    //     <form className="w-full space-y-4">
    //       <div className="flex flex-col gap-2 [&>input]:mb-3">
    //         <Label htmlFor="email">Email</Label>
    //         <Input name="email" placeholder="you@example.com" required />
    //       </div>
    //       <SubmitButton
    //         formAction={forgotPasswordAction}
    //         className="w-full"
    //         pendingText="Sending reset email..."
    //       >
    //         Reset Password
    //       </SubmitButton>
    //     </form>
    //   </CardContent>
    // </Card>
  );
}
