import "./index.css";
import { render } from "solid-js/web";
import App from "./App";
import {
  getItemsFromLocalStorage,
  saveBackupItems,
  setItemStore,
} from "./itemStore";
import { exitRacingMode, getGameMode } from "./gameMode";

// Setup listener for new item discoveries

function checkForChanges() {
  // Check if there's a change in localStorage data
  // React to changes in localStorage
  const items = getItemsFromLocalStorage();
  setItemStore(items);
  if (getGameMode() === "normal") {
    saveBackupItems();
  }
}

// Observe changes in the DOM
const observer = new MutationObserver(checkForChanges);
const itemList = document.getElementsByClassName("items");
observer.observe(itemList[0], {
  childList: true,
  subtree: true,
});

// Create div in the sidebar
const sidebar = document.getElementsByClassName("sidebar");
const root = document.createElement("div");
root.id = "root";

// Append the div to the sidebar
sidebar[0].prepend(root);

const gamemode = getGameMode();

// Render the app
const cleanup = render(() => <App gamemode={gamemode} />, root!);

// Cleanup
window.addEventListener("beforeunload", () => {
  if (window.localStorage.getItem("loadstopper")) {
    window.localStorage.removeItem("loadstopper");
  } else {
    exitRacingMode();
    observer.disconnect();
    cleanup();
  }
});
