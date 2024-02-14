import { createSignal } from "solid-js";
import { getGameMode } from "./gameMode";

export type GameItem = {
  text: string;
  emoji: string;
  discovered: boolean;
};

const defaultItems = [
  { text: "Water", emoji: "💧", discovered: false },
  { text: "Fire", emoji: "🔥", discovered: false },
  { text: "Wind", emoji: "🌬️", discovered: false },
  { text: "Earth", emoji: "🌍", discovered: false },
];

export const getItemsFromLocalStorage = () => {
  const icd = localStorage.getItem("infinite-craft-data");
  if (!icd) {
    return defaultItems;
  }

  const icdParsed = JSON.parse(icd);
  return (icdParsed.elements as GameItem[]) || defaultItems;
};

export const [itemStore, setItemStore] = createSignal<GameItem[]>(
  getItemsFromLocalStorage(),
);

export const addItem = (item: GameItem) => {
  setItemStore((prev) => [...prev, item]);
  localStorage.setItem(
    "infinite-craft-data",
    JSON.stringify({ elements: itemStore() }),
  );
};

export const getBackupItems = () => {
  const icd = localStorage.getItem("backup");
  if (!icd) {
    return defaultItems;
  }

  const icdParsed = JSON.parse(icd);
  return (icdParsed.elements as GameItem[]) || defaultItems;
};

export const restoreBackupItems = () => {
  const backupItems = getBackupItems();
  localStorage.setItem(
    "infinite-craft-data",
    JSON.stringify({ elements: backupItems }),
  );
};

/**
 * Throws if the game mode is racing
 */
export const saveBackupItems = () => {
  const gamemode = getGameMode();
  if (gamemode === "racing") {
    throw new Error("Cannot save backup in racing mode");
  }
  const saveString = JSON.stringify({ elements: itemStore() });
  localStorage.setItem("backup", saveString);
};
