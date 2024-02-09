import "./index.css";
import { render } from "solid-js/web";
import App from "./App";
import { getItemsFromLocalStorage, setItemStore } from "./itemStore";
import { getGameMode } from "./gameMode";

// Setup listener for new item discoveries

function checkForChanges() {
  // Check if there's a change in localStorage data
  // React to changes in localStorage
  const items = getItemsFromLocalStorage();
  setItemStore(items);
}

// Initially set the item store
setItemStore(getItemsFromLocalStorage());

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
render(() => <App gamemode={gamemode} />, root!);
