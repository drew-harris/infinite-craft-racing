import { Show, createContext, createSignal, onMount } from "solid-js";
import { z } from "zod";
import { Game } from "./Game";
import { Button } from "./components/Button";
import { Input } from "./input";
import { defaultGameState, gameStateSchema } from "./messageAndStateSchema";
import { useNetwork } from "./network";
import { hideSidebar } from "./sidebar";
import { Divider } from "./Divider";

type GameContextFormat = {
  gameState: z.infer<typeof gameStateSchema>;
  updateGameState: ReturnType<typeof useNetwork>["updateGameState"];
  isHost: ReturnType<typeof useNetwork>["isHost"];
};

const GameContext = createContext<GameContextFormat>({
  gameState: defaultGameState,
  updateGameState: () => undefined,
  isHost: () => false,
});

export const Lobby = () => {
  const network = useNetwork();

  const [input, setInput] = createSignal("");

  const join = () => {
    network.connectToHostAsClient(input());
  };

  onMount(() => {
    hideSidebar(); // TODO:  make this happen sooner
  });

  const game = (
    <GameContext.Provider
      value={{
        gameState: network.gameStore,
        updateGameState: network.updateGameState,
        isHost: network.isHost,
      }}
    >
      <Game />
    </GameContext.Provider>
  );

  return (
    <Show when={!network.isConnected()} fallback={game}>
      <div class="p-3 pb-0">
        {JSON.stringify(network.isConnected())}
        <div class="text-center">Ask players to join with: </div>
        <div class="text-center text-xl font-bold">{network.hostingId}</div>
        <Divider label="Or" />
        <div class="flex gap-2">
          <Input
            class="flex-grow"
            value={input()}
            placeholder="Enter code to join"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <Button onclick={join}>Join</Button>
        </div>
        <div class="text-red-500">{network.connectErrorMessage()}</div>
      </div>
    </Show>
  );
};
