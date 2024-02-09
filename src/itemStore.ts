import { createSignal } from "solid-js";

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

export const [itemStore, setItemStore] = createSignal<GameItem[]>([]);

export const addItem = (item: GameItem) => {
  setItemStore((prev) => [...prev, item]);
  localStorage.setItem(
    "infinite-craft-data",
    JSON.stringify({ elements: itemStore() }),
  );
};

export const getItemsFromLocalStorage = () => {
  const icd = localStorage.getItem("infinite-craft-data");
  if (!icd) {
    return defaultItems;
  }

  const icdParsed = JSON.parse(icd);
  return (icdParsed.elements as GameItem[]) || defaultItems;
};
