'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import useSupabaseBrowser from '@/utils/supabase/client';
import { GridAPI } from '@/queries/grid.api';
import { Button } from '@/components/ui/button';
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query';
import { useUser } from '@/context/UserContext';
import {
  CircleXIcon,
  EditIcon,
  ExternalLinkIcon,
  LockKeyholeIcon,
  SaveIcon,
  SettingsIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formattedDate } from '@/utils/utils';
import { ConfirmationButton } from './confirmation-button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import GameSelectDropdown from './game-select-dropdown';

export default function GridDataTable() {
  const supabase = useSupabaseBrowser();
  const { userId } = useUser();
  const { toast } = useToast();

  const { data: gridData, refetch } = useQuery(
    GridAPI.v0.getManyGrids(supabase, userId)
  );

  const [editingName, setEditingName] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<string>('');

  const handleDelete = async (id: string, name: string) => {
    const { error } = await GridAPI.v0.deleteGrid(supabase, id);
    if (error) {
      console.error('Error deleting grid:', error.message);
    } else {
      refetch();
      toast({
        title: `${name} deleted`,
        description: 'The grid has been deleted',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateName = async (id: string, name: string) => {
    const { error } = await GridAPI.v0.updateGridName(supabase, id, name);
    if (error) {
      console.error('Error updating grid name:', error.message);
    } else {
      refetch();
      toast({
        title: `${name} updated`,
        description: 'The grid name has been updated',
      });
    }
  };

  const handleUpdateEvent = async (id: string, eventId: string) => {
    const { error } = await GridAPI.v0.updateGridEvent(supabase, id, eventId);
    if (error) {
      console.error('Error updating grid event:', error.message);
    } else {
      refetch();
      toast({
        title: `${eventId} updated`,
        description: 'The grid event has been updated',
      });
    }
  };

  return gridData && gridData.length > 0 ? (
    <Table>
      <TableHeader className="hidden md:table-header-group">
        <TableRow>
          <TableHead />
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Empty Squares</TableHead>
          <TableHead>Game</TableHead>
          <TableHead>Start Time</TableHead>
          <TableHead>Created</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gridData.map((grid) => (
          <TableRow key={grid.id} className="flex flex-col md:table-row">
            <TableCell>
              {grid.locked_at && new Date(grid.locked_at).getTime() > 0 && (
                <LockKeyholeIcon className="w-4 h-4" />
              )}
            </TableCell>
            <TableCell>
              <div className="md:hidden font-medium">Name</div>
              {editingName === grid.uuid ? (
                <form
                  className="flex gap-1 items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateName(grid.uuid!, newName);
                    setEditingName(null);
                  }}
                >
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                  />
                  <Button type="submit" variant="ghost">
                    <SaveIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEditingName(null)}
                    variant="ghost"
                  >
                    <CircleXIcon className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-1">
                  <span>{grid.name}</span>
                  {!grid.locked_at && (
                    <Button
                      variant="ghost"
                      className="opacity-30 hover:opacity-100"
                      size="sm"
                      onClick={() => {
                        setEditingName(grid.uuid!);
                        setNewName(grid.name!);
                      }}
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="md:hidden font-medium">Size</div>
              {grid.num_cols}x{grid.num_rows}
            </TableCell>
            <TableCell>
              <div className="md:hidden font-medium">Empty Squares</div>
              {grid.total_empty_cells}
            </TableCell>
            <TableCell>
              <div className="md:hidden font-medium">Game</div>
              {editingEvent === grid.uuid ? (
                <form
                  className="flex gap-1 items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateEvent(grid.uuid!, newEvent);
                    setEditingEvent(null);
                  }}
                >
                  <GameSelectDropdown
                    handleEventChange={(eventId) => setNewEvent(eventId)}
                    defaultValue={grid.nfl_schedule?.event_id}
                  />
                  <Button type="submit" variant="ghost">
                    <SaveIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    variant="ghost"
                  >
                    <CircleXIcon className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-1">
                  <span>{grid.nfl_schedule?.short_name}</span>
                  {!grid.locked_at && (
                    <Button
                      variant="ghost"
                      className="opacity-30 hover:opacity-100"
                      size="sm"
                      onClick={() => {
                        setEditingEvent(grid.uuid!);
                        setNewEvent(grid.nfl_schedule?.event_id ?? '');
                      }}
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="md:hidden font-medium">Start Time</div>
              {grid.nfl_schedule?.date
                ? formattedDate(new Date(grid.nfl_schedule?.date))
                : ''}
            </TableCell>
            <TableCell>
              <div className="md:hidden font-medium">Created</div>
              {grid.created_at
                ? formattedDate(new Date(grid.created_at))
                : 'N/A'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2 justify-between">
                <Button asChild variant={'ghost'}>
                  <Link target="_blank" href={`/${grid.uuid}`}>
                    <ExternalLinkIcon className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant={'ghost'}>
                  <Link href={`/protected/${grid.uuid}`}>
                    <SettingsIcon className="w-4 h-4" />
                  </Link>
                </Button>
                <ConfirmationButton
                  handleSubmit={() => handleDelete(grid.uuid!, grid.name!)}
                  confirmationText="Are you sure you want to delete this grid?"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div>No grids found</div>
  );
}
