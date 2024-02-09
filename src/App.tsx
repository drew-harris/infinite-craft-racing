import { Gamemode } from "./gameMode";
import { itemStore } from "./itemStore";

interface AppProps {
  gamemode: Gamemode;
}

function App(props: AppProps) {
  return (
    <div class="items p-3">
      <div>You Have {itemStore().length} Items</div>
      Gamemode: {props.gamemode}
      <div class="border mt-3 border-gray-200"></div>
    </div>
  );
}

export default App;
