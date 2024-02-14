import { restoreBackupItems, saveBackupItems } from "./itemStore";

export type Gamemode = "normal" | "racing";

export const getGameMode = (): Gamemode => {
  const mode = localStorage.getItem("game-mode");
  if (!mode) {
    localStorage.setItem("game-mode", "normal");
    return "normal";
  }
  return mode as Gamemode;
};

export const setGameMode = (mode: Gamemode) => {
  localStorage.setItem("game-mode", mode);
};

export const enterRacingMode = () => {
  // Make a backup of the current list of items
  const gamemode = getGameMode();
  if (gamemode === "racing") {
    throw new Error("Already in racing mode");
  }
  saveBackupItems();

  localStorage.removeItem("infinite-craft-data");

  setGameMode("racing");
};

export const exitRacingMode = () => {
  const gamemode = getGameMode();
  if (gamemode === "normal") {
    throw new Error("Already in normal mode");
  }

  restoreBackupItems();
  setGameMode("normal");
};
