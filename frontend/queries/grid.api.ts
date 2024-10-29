import { TablesInsert, TablesUpdate } from '@/utils/generated/database.types';
import { ScoreTypes, TypedSupabaseClient, WinnerTypes } from '@/utils/types';
import { getISODateShort } from '@/utils/utils';

export const GridAPI = {
  v0: {
    getManyGrids: (client: TypedSupabaseClient, userId: string) => {
      return client
        .from('grids')
        .select('*, nfl_schedule(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    },
    getGrid: (client: TypedSupabaseClient, gridId: string) => {
      return client
        .from('grids')
        .select(
          `
            *,
            nfl_schedule (
            *,
            home_team:teams!nfl_schedule_home_team_id_fkey (name, abbreviation, display_name, logos, record),
            away_team:teams!nfl_schedule_away_team_id_fkey (name, abbreviation, display_name, logos, record)
            )
            `
        )
        .eq('uuid', gridId)
        .single();
    },
    getManyCells: (client: TypedSupabaseClient, gridId: string) => {
      return client.from('cell_assignments').select('*').eq('grid_id', gridId);
    },
    getUpcomingSchedules: (client: TypedSupabaseClient) => {
      const currentDate = getISODateShort();
      return client
        .from('nfl_schedule')
        .select('*')
        .gte('date', currentDate)
        .order('date', { ascending: true });
    },
    getScore: (client: TypedSupabaseClient, eventId: string) => {
      return client
        .from('nfl_scores')
        .select('*')
        .eq('event_id', eventId)
        .single();
    },
    subscribeToScore: (
      client: TypedSupabaseClient,
      eventId: string,
      callback: (payload: {
        new: ScoreTypes;
        old: ScoreTypes;
        eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      }) => void
    ) => {
      return client
        .channel(`nfl_scores:${eventId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'nfl_scores',
            filter: `event_id=eq.${eventId}`,
          },
          (payload) => {
            callback({
              new: payload.new as ScoreTypes,
              old: payload.old as ScoreTypes,
              eventType: payload.eventType,
            });
          }
        )
        .subscribe();
    },
    createGrid: (
      client: TypedSupabaseClient,
      userId: string,
      gridName: string,
      numCols: number = 10,
      numRows: number = 10,
      eventId: string
    ) => {
      const insertData: TablesInsert<'grids'> = {
        user_id: userId,
        name: gridName,
        num_cols: numCols,
        num_rows: numRows,
        event_id: eventId,
      };
      return client.from('grids').insert(insertData).select().single();
    },
    updateGridLockedAt: (
      client: TypedSupabaseClient,
      gridId: string,
      locked_at: string | null
    ) => {
      const updateData: TablesUpdate<'grids'> = { locked_at };

      return client.from('grids').update(updateData).eq('uuid', gridId);
    },
    updateGridName: (
      client: TypedSupabaseClient,
      gridId: string,
      name: string
    ) => {
      const updateData: TablesUpdate<'grids'> = { name };
      return client.from('grids').update(updateData).eq('uuid', gridId);
    },
    updateGridEvent: (
      client: TypedSupabaseClient,
      gridId: string,
      eventId: string
    ) => {
      const updateData: TablesUpdate<'grids'> = { event_id: eventId };
      return client.from('grids').update(updateData).eq('uuid', gridId);
    },
    createManyCells: (
      client: TypedSupabaseClient,
      gridId: string,
      numCols: number,
      numRows: number
    ) => {
      const cellsToInsert = [];
      const rowValues = Array.from({ length: numRows }, (_, i) => i).sort(
        () => Math.random() - 0.5
      );
      const colValues = Array.from({ length: numCols }, (_, i) => i).sort(
        () => Math.random() - 0.5
      );

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          cellsToInsert.push({
            grid_id: gridId,
            row_index: row,
            col_index: col,
            assigned_row_value: rowValues[row],
            assigned_col_value: colValues[col],
            assigned_value: null, // All assigned values are null
          });
        }
      }
      return client.from('cell_assignments').insert(cellsToInsert);
    },
    createWinners: (client: TypedSupabaseClient, gridId: string) => {
      return client.from('winners').insert({ grid_id: gridId });
    },
    getWinners: (client: TypedSupabaseClient, gridId: string) => {
      return client.from('winners').select('*').eq('grid_id', gridId).single();
    },
    updateCell: (
      client: TypedSupabaseClient,
      gridId: string,
      cellId: number,
      assignedValue: string | null
    ) => {
      return client
        .from('cell_assignments')
        .update({ assigned_value: assignedValue })
        .eq('grid_id', gridId)
        .eq('id', cellId);
    },
    updateManyCells: (
      client: TypedSupabaseClient,
      gridId: string,
      cellIds: number[],
      assigned_value: string | null
    ) => {
      const updatedData: TablesUpdate<'cell_assignments'> = { assigned_value };
      return client
        .from('cell_assignments')
        .update(updatedData)
        .eq('grid_id', gridId)
        .in('id', cellIds);
    },

    updateManyCellsV2: (
      client: TypedSupabaseClient,
      assignments: { id: number; assigned_value: string }[]
    ) => {
      return client.from('cell_assignments').upsert(assignments);
    },
    deleteGrid: (client: TypedSupabaseClient, gridId: string) => {
      return client.from('grids').delete().eq('uuid', gridId);
    },
    resetManyCells: (client: TypedSupabaseClient, gridId: string) => {
      return client
        .from('cell_assignments')
        .update({ assigned_value: null })
        .eq('grid_id', gridId);
    },
    subscribeToWinners: (
      client: TypedSupabaseClient,
      gridId: string,
      callback: (payload: {
        new: WinnerTypes;
        old: WinnerTypes;
        eventType: 'INSERT' | 'UPDATE' | 'DELETE';
      }) => void
    ) => {
      return client
        .channel(`winners:${gridId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'winners',
            filter: `grid_id=eq.${gridId}`,
          },
          (payload) => {
            callback({
              new: payload.new as WinnerTypes,
              old: payload.old as WinnerTypes,
              eventType: payload.eventType,
            });
          }
        )
        .subscribe();
    },
  },
};
