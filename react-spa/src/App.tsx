import { useState, useEffect } from 'react';
import type { NBATeam } from '@balldontlie/sdk';
import { Select, MenuItem, Stack, Box, Typography, TextField, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import * as api from './api';
import { countDraftRounds } from './helpers';
import NBALogo from './assets/nba.png';

const columns: GridColDef[] = [
  { field: 'round', headerName: 'Draft Round', flex: 1 },
  { field: 'count', headerName: 'Player Count', flex: 1, type: 'number' },
];

const initialPaginationModel = {
  page: 0,
  pageSize: 100,
}

function App() {
  const [teams, setTeams] = useState<NBATeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<NBATeam | undefined>();
  const [apiKey, setApiKey] = useState(api.DEFAULT_API_KEY);
  const [draftBreakdown, setDraftBreakdown] = useState<Record<string, number>>({});
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [paginationModel, setPaginationModel] = useState(initialPaginationModel);

  const getTeams = async () => {
    try {
      const teams = await api.getAllTeams();
      setTeams(teams);
    } catch (e) {
      // We can write some nice error handling here. For now let's just log it.
      console.log('Unable to fetch all NBA teams.', e);
      alert('Unable to fetch all NBA teams. Please check the console log for more info. This is likely a network error or an invalid API key.');
    }
  };

  const getTeamDraftCounts = async (teamId: number) => {
    try {
      setLoadingPlayers(true);
      // Cursor based pagination requires a bit more work to support.
      // For now, we'll just use the page size features.
      const players = await api.getPlayersByTeamId({
        team_ids: [teamId],
        per_page: paginationModel.pageSize,
      });

      const draftRoundCounts = countDraftRounds(players);

      setDraftBreakdown(draftRoundCounts);
    } catch (e) {
      // We can write some nice error handling here. For now let's just log it.
      console.log('Unable to create draft round breakdown.', e);
      alert('Unable to create draft round breakdown. Please check the console log for more info. This is likely a network error or an invalid API key.');
    } finally {
      setLoadingPlayers(false);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    if (!selectedTeam) return;
    getTeamDraftCounts(selectedTeam.id);
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
          onChange={(e) => setApiKey(e.target.value)}
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
            setPaginationModel(initialPaginationModel);
            const selectedTeamId = e.target.value;
            const newTeam = teams.find(
              ({ id }) => id.toString() == selectedTeamId
            );
            setSelectedTeam(newTeam);
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
