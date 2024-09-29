import { TablesInsert, TablesUpdate } from '@/utils/generated/database.types';
import { TypedSupabaseClient } from '@/utils/types';
import { getCurrentISODate } from '@/utils/utils';

export const GridAPI = {
  getAll: (client: TypedSupabaseClient, userId: string) => {
    return client
      .from('grids')
      .select('*, nfl_schedule(name, short_name, event_id, date)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  getGridInfo: (client: TypedSupabaseClient, gridId: string) => {
    return client
      .from('grids')
      .select('*, nfl_schedule(name, short_name, event_id, date)')
      .eq('uuid', gridId)
      .single();
  },

  countEmptyCells: (client: TypedSupabaseClient, gridId: string) => {
    return client
      .from('grid_cells')
      .select('*', { count: 'exact', head: true })
      .eq('grid_id', gridId)
      .is('name', null);
  },
  resetAll: (client: TypedSupabaseClient, gridId: string) => {
    return client
      .from('grid_cells')
      .update({ name: null })
      .eq('grid_id', gridId)
      .neq('name', null);
  },
  update: (
    client: TypedSupabaseClient,
    gridId: string,
    cellId: string,
    name: string | null
  ) => {
    const updateData: TablesUpdate<'grid_cells'> = { name };
    return client
      .from('grid_cells')
      .update(updateData)
      .eq('grid_id', gridId)
      .eq('uuid', cellId);
  },
  updateMany: (
    client: TypedSupabaseClient,
    gridId: string,
    cellIds: string[],
    name: string | null
  ) => {
    const updateData: TablesUpdate<'grid_cells'> = { name };
    return client
      .from('grid_cells')
      .update(updateData)
      .eq('grid_id', gridId)
      .in('uuid', cellIds);
  },
  addGrid: (
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
  deleteGrid: (client: TypedSupabaseClient, gridId: string) => {
    return client.from('grids').delete().eq('uuid', gridId);
  },
  createGridCells: (
    client: TypedSupabaseClient,
    gridId: string,
    numCols: number,
    numRows: number
  ) => {
    const cellsToInsert = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        cellsToInsert.push({
          grid_id: gridId,
          row: row,
          col: col,
          name: null,
        });
      }
    }
    return client.from('grid_cells').insert(cellsToInsert);
  },
  getGridCells: (client: TypedSupabaseClient, gridId: string) => {
    return client
      .from('grid_cells')
      .select('*')
      .eq('grid_id', gridId)
      .order('row', { ascending: true })
      .order('col', { ascending: true });
  },
  createGridRowAssignments: (
    client: TypedSupabaseClient,
    gridId: string,
    numRows: number
  ) => {
    const values = Array.from({ length: numRows }, (_, i) => i);
    const shuffledValues = values.sort(() => Math.random() - 0.5);

    const rowsToInsert = shuffledValues.map((value, row) => ({
      grid_id: gridId,
      row: row,
      value: value,
    }));
    return client.from('grid_row_assignments').insert(rowsToInsert);
  },
  createGridColAssignments: (
    client: TypedSupabaseClient,
    gridId: string,
    numCols: number
  ) => {
    const values = Array.from({ length: numCols }, (_, i) => i);
    const shuffledValues = values.sort(() => Math.random() - 0.5);

    const colsToInsert = shuffledValues.map((value, col) => ({
      grid_id: gridId,
      col: col,
      value: value,
    }));
    return client.from('grid_col_assignments').insert(colsToInsert);
  },
  getGridRowAssignments: (client: TypedSupabaseClient, gridId: string) => {
    return client
      .from('grid_row_assignments')
      .select('*')
      .eq('grid_id', gridId)
      .order('row', { ascending: true });
  },
  getGridColAssignments: (client: TypedSupabaseClient, gridId: string) => {
    return client
      .from('grid_col_assignments')
      .select('*')
      .eq('grid_id', gridId)
      .order('col', { ascending: true });
  },
  getSchedule: (client: TypedSupabaseClient) => {
    const currentDate = getCurrentISODate();
    return client
      .from('nfl_schedule')
      .select('*')
      .gte('date', currentDate)
      .order('date', { ascending: true });
  },
  getEvent: (client: TypedSupabaseClient, eventId: string) => {
    return client
      .from('nfl_schedule')
      .select('*')
      .eq('event_id', eventId)
      .single();
  },
  getGame: (client: TypedSupabaseClient, eventId: string) => {
    return (
      client
        .from('nfl_scores')
        //   .select('*, nfl_schedule(home_team_id, away_team_id)')
        .select(
          `
        *,
        nfl_schedule (
          home_team:teams!nfl_schedule_home_team_id_fkey(name, abbreviation),
          away_team:teams!nfl_schedule_away_team_id_fkey(name, abbreviation)
        )
      `
        )
        .eq('event_id', eventId)
        .single()
    );
  },
  v2: {
    getCellAssignments: (client: TypedSupabaseClient, gridId: number) => {
      return client.from('cell_assignments').select('*').eq('grid_id', gridId);
    },
    createCellAssignments: (
      client: TypedSupabaseClient,
      gridId: number,
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
    updateCellAssignment: (
      client: TypedSupabaseClient,
      gridId: number,
      rowIndex: number,
      colIndex: number,
      assignedValue: string
    ) => {
      return client
        .from('cell_assignments')
        .update({ assigned_value: assignedValue })
        .eq('grid_id', gridId)
        .eq('row_index', rowIndex)
        .eq('col_index', colIndex);
    },
  },
};
