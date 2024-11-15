'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useState } from 'react';
import { useGridContext } from '@/context/GridContext';

import AddPlayersForm from './add-players-form';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import { DialogClose } from '@radix-ui/react-dialog';

export default function ActionButtonGroup() {
  const [open, setOpen] = useState<boolean>(false);
  //   const isDesktop = useMediaQuery('(min-width: 768px)');
  const { gridInfo } = useGridContext();

  //   const Desktop = () => {
  //     return (
  //       <Dialog open={open} onOpenChange={setOpen}>
  //         <DialogTrigger asChild>
  //           <Button variant="default">Add Players</Button>
  //         </DialogTrigger>
  //         <DialogContent className="sm:max-w-[425px]">
  //           <DialogHeader>
  //             <DialogTitle>Add Players</DialogTitle>
  //             <DialogDescription>Add players to the square(s).</DialogDescription>
  //           </DialogHeader>
  //           <AddPlayersForm setOpen={setOpen} />
  //         </DialogContent>
  //       </Dialog>
  //     );
  //   };

  const Mobile = () => {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="default">Add Players</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add Players</DrawerTitle>
            <DrawerDescription>Add players to the square(s).</DrawerDescription>
          </DrawerHeader>
          <AddPlayersForm className="px-4" setOpen={setOpen} />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div className="flex flex-col md:flex-row pt-4 md:pt-0 gap-4">
      {!gridInfo.locked_at && (
        <>
          {/* {isDesktop ? <Desktop /> : <Mobile />} */}
          <Mobile />
          <LockSquaresButton />
        </>
      )}
      <Button className="hidden md:inline-flex" asChild variant="ghost">
        <Link href={`/${gridInfo.uuid}`} target="_blank">
          <ExternalLinkIcon className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}

export function LockSquaresButton() {
  const [open, setOpen] = useState<boolean>(false);

  const { handleLockGrid } = useGridContext();

  const _handleLockGrid = () => {
    handleLockGrid(true);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Assign Numbers</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <DialogTitle>Confirm Assign Numbers</DialogTitle>
          <DialogDescription>
            Are you sure you want to assign numbers? This will lock the squares
            and you will not be able to edit them.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col space-y-4 md:space-y-0 justify-end mt-4">
          <Button variant="destructive" onClick={_handleLockGrid}>
            Confirm
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
