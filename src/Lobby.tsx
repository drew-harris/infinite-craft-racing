import { Match, Switch, createContext, createSignal, onMount } from "solid-js";
import { z } from "zod";
import { Divider } from "./Divider";
import { Game } from "./Game";
import { Button } from "./components/Button";
import { Input } from "./input";
import { defaultGameState, gameStateSchema } from "./messageAndStateSchema";
import { useNetwork } from "./network";
import { playerName, setPlayerName } from "./playerName";
import { hideSidebar } from "./sidebar";

type GameContextFormat = {
  gameState: z.infer<typeof gameStateSchema>;
  updateGameState: ReturnType<typeof useNetwork>["updateGameState"];
  isHost: ReturnType<typeof useNetwork>["isHost"];
  playerName: string;
};

export const GameContext = createContext<GameContextFormat>({
  gameState: defaultGameState,
  updateGameState: () => undefined,
  isHost: () => false,
  playerName: "",
});

export const Lobby = () => {
  const network = useNetwork();

  const [input, setInput] = createSignal("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
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
        playerName: playerName() || "ERROR",
      }}
    >
      <Game />
    </GameContext.Provider>
  );

  return (
    <Switch fallback={game}>
      <Match when={playerName() === null}>
        <PromptForName />
      </Match>
      <Match when={!network.isConnected()}>
        <div class="p-3 pb-0">
          <div class="text-center">Ask players to join with: </div>
          <div class="text-center text-xl font-bold">{network.hostingId}</div>
          <Divider label="Or" />
          <form
            class="flex items-center justify-center gap-2"
            onSubmit={handleSubmit}
          >
            <Input
              maxlength={5}
              value={input().toUpperCase()}
              placeholder="Enter code to join"
              oninput={(e) => {
                console.log("setting value to ", e.target.value.toUpperCase());
                setInput(e.target.value.toUpperCase());
              }}
            />
            <Button type="submit">Join</Button>
          </form>
          <div class="text-red-500">{network.connectErrorMessage()}</div>
        </div>
      </Match>
    </Switch>
  );
};

const PromptForName = () => {
  const [input, setInput] = createSignal("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPlayerName(input());
  };

  return (
    <div class="p-3 pb-0">
      <form
        class="flex items-center justify-center gap-2"
        onSubmit={handleSubmit}
      >
        <Input
          value={input()}
          placeholder="Enter your name"
          oninput={(e) => setInput(e.target.value)}
        />
        <Button type="submit">Enter</Button>
      </form>
    </div>
  );
};
