import { z } from 'zod';

export const ApiTeamSchema = z.object({
  TeamId: z.string(),
  teamName: z.string(),
  ownerId: z.string(),
  members: z.array(z.string()),
  updatedAt: z.number(),
  createdAt: z.number(),
});




  export type Team = z.infer<typeof ApiTeamSchema>;