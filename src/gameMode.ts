export type Gamemode = "normal" | "racing";

export const getGameMode = (): Gamemode => {
  const mode = localStorage.getItem("game-mode");
  if (!mode) {
    localStorage.setItem("game-mode", "normal");
    return "normal";
  }
  return mode as Gamemode;
};
