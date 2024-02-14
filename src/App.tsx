import { Lobby } from "./Lobby";
import { Button } from "./components/Button";
import { Gamemode, enterRacingMode } from "./gameMode";

interface AppProps {
  gamemode: Gamemode;
}

function App(props: AppProps) {
  if (props.gamemode === "racing") {
    return <Lobby />;
  }

  return <StartGame />;
}

function StartGame() {
  const enterRaceMode = () => {
    console.log("enetering race mode");
    enterRacingMode();
    window.localStorage.setItem("loadstopper", "true");
    // Wait for localstorage to set the item so window unload runs properly
    window.setTimeout(() => {
      console.log("reloading");
      window.location.reload();
    }, 10);
  };

  return (
    <div class="flex items-center justify-center p-3 pb-0">
      <Button class="m-auto" onclick={enterRaceMode}>
        Enter Race Mode
      </Button>
      <div class="mt-3 border border-gray-200 active:bg-gray-50"></div>
    </div>
  );
}

export default App;
