import type { NBAPlayer } from '@balldontlie/sdk';

export function countDraftRounds(players: NBAPlayer[]): Record<string, number> {
  return players.reduce(
    (roundCounts, player) => {
      const round = player.draft_round;
      const key = round === 1 || round === 2 ? round : 'other';
      roundCounts[key] = (roundCounts[key] || 0) + 1;

      return roundCounts;
    },
    { 1: 0, 2: 0, other: 0 }
  );
}

export const mockPlayers: NBAPlayer[] = [
  {
    id: 1,
    first_name: 'LeBron',
    last_name: 'James',
    position: 'F',
    height: '6-9',
    weight: '250',
    jersey_number: '23',
    college: '',
    country: 'USA',
    draft_year: 2003,
    draft_round: 1,
    draft_number: 1,
    team: {
      id: 13,
      conference: 'West',
      division: 'Pacific',
      city: 'Los Angeles',
      name: 'Lakers',
      full_name: 'Los Angeles Lakers',
      abbreviation: 'LAL',
    },
  },
  {
    id: 2,
    first_name: 'Stephen',
    last_name: 'Curry',
    position: 'G',
    height: '6-2',
    weight: '185',
    jersey_number: '30',
    college: 'Davidson',
    country: 'USA',
    draft_year: 2009,
    draft_round: 1,
    draft_number: 7,
    team: {
      id: 10,
      conference: 'West',
      division: 'Pacific',
      city: 'Golden State',
      name: 'Warriors',
      full_name: 'Golden State Warriors',
      abbreviation: 'GSW',
    },
  },
  {
    id: 3,
    first_name: 'Nikola',
    last_name: 'Jokić',
    position: 'C',
    height: '6-11',
    weight: '284',
    jersey_number: '15',
    college: '',
    country: 'Serbia',
    draft_year: 2014,
    draft_round: 2,
    draft_number: 41,
    team: {
      id: 7,
      conference: 'West',
      division: 'Northwest',
      city: 'Denver',
      name: 'Nuggets',
      full_name: 'Denver Nuggets',
      abbreviation: 'DEN',
    },
  },
  {
    id: 4,
    first_name: 'Alex',
    last_name: 'Caruso',
    position: 'G',
    height: '6-5',
    weight: '186',
    jersey_number: '6',
    college: 'Texas A&M',
    country: 'USA',
    draft_year: 2000,
    draft_round: 3,
    draft_number: 83,
    team: {
      id: 4,
      conference: 'East',
      division: 'Central',
      city: 'Chicago',
      name: 'Bulls',
      full_name: 'Chicago Bulls',
      abbreviation: 'CHI',
    },
  },
];