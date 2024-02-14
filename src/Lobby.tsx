import { createContext, createSignal, onMount } from "solid-js";
import { Button } from "./components/Button";
import { exitRacingMode } from "./gameMode";
import { useNetwork } from "./network";
import { z } from "zod";
import { defaultGameState, gameStateSchema } from "./messageAndStateSchema";
import { Game } from "./Game";
import { hideSidebar } from "./sidebar";

type GameContextFormat = {
  gameState: z.infer<typeof gameStateSchema>;
  updateGameState: ReturnType<typeof useNetwork>["updateGameState"];
};

const GameContext = createContext<GameContextFormat>({
  gameState: defaultGameState,
  updateGameState: () => undefined,
});

export const Lobby = () => {
  const stopPlaying = () => {
    exitRacingMode();
    window.location.reload();
  };

  const network = useNetwork();

  const [input, setInput] = createSignal("");

  const join = () => {
    network.connectToHostAsClient(input());
  };

  onMount(() => {
    hideSidebar(); // TODO:  make this happen sooner
  });

  if (network.isConnected()) {
    return (
      <GameContext.Provider
        value={{
          gameState: network.gameStore,
          updateGameState: network.updateGameState,
        }}
      >
        <Game />
      </GameContext.Provider>
    );
  }

  return (
    <div class="p-3 pb-0">
      <div>Playing game!!!</div>
      <div>{network.hostingId}</div>
      <input
        value={input()}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <button onclick={join}>JOIN</button>
      <Button onclick={stopPlaying}>Stop playing</Button>
    </div>
  );
};
