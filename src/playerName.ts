import { createSignal } from "solid-js";

const getPlayerName = (): string | null => {
  return localStorage.getItem("playerName");
};

const setPlayerName = (name: string) => {
  localStorage.setItem("playerName", name);
  _setPlayerName(name);
};

const [playerName, _setPlayerName] = createSignal(getPlayerName());

export { playerName, setPlayerName };
