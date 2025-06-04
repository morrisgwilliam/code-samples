import { useEffect } from 'react';
import { Select, MenuItem, Stack, Box, Typography, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import * as api from './api';
import NBALogo from './assets/nba.png';
import {useDispatch, useSelector} from "./state/hooks"
import { getDraftCounts, getTeams, setApiKey, setPaginationModel, selectTeam } from './state/homeSlice';

const columns: GridColDef[] = [
  { field: 'round', headerName: 'Draft Round', flex: 1 },
  { field: 'count', headerName: 'Player Count', flex: 1, type: 'number' },
];

function App() {
  const dispatch = useDispatch();
  const { 
    teams,
    selectedTeam,
    loadingPlayers,
    draftBreakdown,
    paginationModel,
    apiKey,
   } = useSelector(({home}) => home);

  useEffect(() => {
    dispatch(getTeams());
  }, []);

  useEffect(() => {
    if (!selectedTeam) return;
    dispatch(getDraftCounts());
  }, [selectedTeam, paginationModel]);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'whitesmoke',
        justifyContent: 'center',
      }}
    >
      <Stack>
        <img
          src={NBALogo}
          alt="Logo"
          width={200}
          style={{ marginLeft: 'auto', marginRight: 'auto' }}
        />
        <Typography variant="h2" color="black" marginTop="1rem" marginBottom="1rem">
          NBA Draft Stats
        </Typography>
        <Stack flexDirection="row" gap="1rem" alignContent="center">
        <TextField 
          label='Ball Dont Lie API Key'
          helperText="Get a free api key at https://www.balldontlie.io/#getting-started"
          value={apiKey}
          onChange={(e) => dispatch(setApiKey(e.target.value))}
          style={{marginBottom: '1rem'}}
          />
          <Button 
          variant="contained"
          style={{maxHeight: "25px"}}
          onClick={() => api.setApiKey(apiKey)}>
            Set API Key
          </Button>
        </Stack>
        <Select
          labelId="team-select-label"
          value={selectedTeam?.id || "unkown"}
          label="NBA Team"
          title="NBA Team"
          color="error"
          onChange={(e) => {
            dispatch(setPaginationModel({
              page: 0,
              pageSize: 100,
            }));
            const selectedTeamId = e.target.value;
            const newTeam = teams.find(
              ({ id }) => id.toString() == selectedTeamId
            );
            dispatch(selectTeam(newTeam));
          }}
        >
          {teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              {team.full_name}
            </MenuItem>
          ))}
        </Select>
        <div style={{ height: 300, width: '100%', marginTop: '2rem' }}>
          <DataGrid
            paginationMode='client'
            loading={loadingPlayers}
            rows={Object.entries(draftBreakdown).map(([round, count], idx) => ({
              id: idx + 1,
              round,
              count,
            }))}
            columns={columns}
            hideFooterSelectedRowCount
            disableRowSelectionOnClick
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={Object.entries(draftBreakdown).length}
            pageSizeOptions={[10, 25, 50, 100]}
          />
        </div>
      </Stack>
    </Box>
  );
}

export default App;
