import { For, onMount, useContext } from "solid-js";
import { GameContext } from "./Lobby";

export const Game = () => {
  const { playerName, updateGameState, gameState } = useContext(GameContext);
  onMount(() => {
    updateGameState("players", playerName, {
      name: playerName,
    });
  });
  return (
    <div>
      <div>Players</div>
      <For each={Object.keys(gameState.players)}>
        {(playerName) => <div>{gameState.players[playerName].name}</div>}
      </For>
    </div>
  );
};
