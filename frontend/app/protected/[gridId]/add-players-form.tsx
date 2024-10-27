import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useGridContext } from '@/context/GridContext';

export default function AddPlayersForm({
  className,
  setOpen,
}: React.ComponentProps<'form'> & { setOpen: (open: boolean) => void }) {
  const { numEmptyCells, handleRandomAssign } = useGridContext();
  const [players, setPlayers] = useState([{ name: '', count: 1 }]);
  const [remainingCells, setRemainingCells] = useState(numEmptyCells);

  useEffect(() => {
    const totalAssigned = players.reduce(
      (sum, player) => sum + player.count,
      0
    );
    setRemainingCells(numEmptyCells - totalAssigned);
  }, [players, numEmptyCells]);

  const addPlayer = () => {
    if (remainingCells > 0) {
      setPlayers([...players, { name: '', count: 1 }]);
    }
  };

  const updatePlayer = (
    index: number,
    field: 'name' | 'count',
    value: string | number
  ) => {
    const newPlayers = [...players];
    if (field === 'count') {
      const newCount = Number(value);
      const currentTotal = players.reduce(
        (sum, p, i) => sum + (i === index ? 0 : p.count),
        0
      );
      const maxAllowed = numEmptyCells - currentTotal;
      newPlayers[index][field] = Math.min(newCount, maxAllowed);
    } else {
      newPlayers[index][field] = value as string;
    }
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRandomAssign(players);

    setOpen(false);
  };

  return (
    <form
      className={cn('grid items-start gap-4', className)}
      onSubmit={handleSubmit}
    >
      {players.map((player, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-2">
          <div className="grid gap-2">
            <Label htmlFor={`name-${index}`}>Name</Label>
            <Input
              type="text"
              id={`name-${index}`}
              value={player.name}
              onChange={(e) => updatePlayer(index, 'name', e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div className="grid gap-2">
            <Label># Squares</Label>
            <Select
              value={String(player.count)}
              onValueChange={(value) =>
                updatePlayer(index, 'count', Number(value))
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Array.from(
                    {
                      length: Math.min(
                        remainingCells + player.count,
                        numEmptyCells
                      ),
                    },
                    (_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {String(i + 1)}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[40px] flex items-end">
            {index === players.length - 1 && remainingCells > 0 && (
              <Button type="button" onClick={addPlayer} className="self-end">
                +
              </Button>
            )}
          </div>
        </div>
      ))}
      <div>Free cells: {numEmptyCells}</div>
      <Button
        type="submit"
        disabled={
          players.every((p) => !p.name) || remainingCells === numEmptyCells
        }
      >
        Save changes
      </Button>
    </form>
  );
}
