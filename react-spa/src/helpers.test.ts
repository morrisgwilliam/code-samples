import type { NBAPlayer } from '@balldontlie/sdk';
import { countDraftRounds, mockPlayers } from './helpers';



test('counts draft rounds from players correctly', () => {
  const result = countDraftRounds(mockPlayers);
  expect(result).toEqual({ '1': 2, '2': 1, other: 1 });
});
