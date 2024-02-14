import { z } from "zod";

export const defaultGameState = {
  text: "working",
};

export const gameStateSchema = z.object({
  text: z.string(),
});

export const stateUpdateMessageSchema = z.object({
  type: z.string(),
  payload: gameStateSchema,
});
