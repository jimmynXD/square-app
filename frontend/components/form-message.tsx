import { Siren, ThumbsUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({
  message,
  className,
}: {
  message: Message;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 w-full max-w-md text-sm  mb-6',
        className
      )}
    >
      {'success' in message && (
        <Alert variant="default" className="border-none rounded-none">
          <ThumbsUp className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message.success}</AlertDescription>
        </Alert>
      )}
      {'error' in message && (
        <Alert variant="destructiveFilled" className="border-none rounded-none">
          <Siren className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{message.error}</AlertDescription>
        </Alert>
      )}
      {'message' in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
}
