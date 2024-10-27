'use client';

import { Button } from '@/components/ui/button';
import {
  DialogFooter,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TrashIcon } from 'lucide-react';

import { useState } from 'react';

export type ConfirmationButtonProps = {
  handleSubmit: () => void;
  confirmationText: string;
};
export function ConfirmationButton({
  handleSubmit,
  confirmationText,
}: ConfirmationButtonProps) {
  const [open, setOpen] = useState<boolean>(false);

  const _handleClick = () => {
    handleSubmit();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive-ghost">
          {' '}
          <TrashIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>{confirmationText}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end mt-4">
          <Button variant="destructive" onClick={_handleClick}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
