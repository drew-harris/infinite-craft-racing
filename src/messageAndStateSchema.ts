import { z } from "zod";

export const itemSchema = z.object({
  text: z.string(),
  emoji: z.string(),
  discovered: z.boolean(),
});

export const defaultGameState: z.infer<typeof gameStateSchema> = {
  players: {},
  betting: {
    enabled: false,
    betAmount: 0,
  },
  hasStarted: false,
  startTime: "0",
  targetWord: "",
};

const playerDataSchema = z.object({
  name: z.string().optional(),
  latestItem: itemSchema.optional(),
});

export const gameStateSchema = z.object({
  players: z.record(playerDataSchema),
  betting: z.object({
    enabled: z.boolean(),
    betAmount: z.number().optional(),
  }),
  hasStarted: z.boolean().default(false),
  startTime: z.string(),
  targetWord: z.string(),
});

export const stateUpdateMessageSchema = z.object({
  type: z.string(),
  payload: gameStateSchema,
});
