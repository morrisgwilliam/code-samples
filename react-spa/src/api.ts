import { BalldontlieAPI } from '@balldontlie/sdk';
import type { NBATeam, NBAPlayer } from '@balldontlie/sdk';

export const DEFAULT_API_KEY = 'bdbc6898-0f12-4fab-8417-f7d2bb55d09b'

const config = {
  apiKey: DEFAULT_API_KEY,
};

let api = new BalldontlieAPI(config);

/**
 * Updates the API key in the configuration and reinitializes the API instance.
 * @param newApiKey - The new API key to set.
 */
export const setApiKey = (newApiKey: string): void => {
  config.apiKey = newApiKey;
  api = new BalldontlieAPI(config);
};

export const getAllTeams = async (): Promise<NBATeam[]> => {
  const { data: teams } = await api.nba.getTeams();
  return teams;
};

export async function getPlayersByTeamId(params: {
  cursor?: number;
  per_page?: number;
  team_ids?: number[];
  player_ids?: number[];
  search?: string;
  first_name?: string;
  last_name?: string;
}): Promise<NBAPlayer[]> {
  const { data: players } = await api.nba.getPlayers(params);
  return players;
}
