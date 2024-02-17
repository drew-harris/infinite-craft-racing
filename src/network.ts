import { customAlphabet } from "nanoid";
import Peer, { DataConnection } from "peerjs";
import { createSignal } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { z } from "zod";
import {
  defaultGameState,
  gameStateSchema,
  playerStoreSchema,
  stateUpdateMessage,
} from "./messageAndStateSchema";
import { playerName } from "./playerName";

const customAlph = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

const myPlayerId = customAlph(5);

export const useNetwork = () => {
  const hostingId = customAlph(5);
  const [isConnected, setIsconnected] = createSignal(false);
  const [isHost, setIsHost] = createSignal(false);

  const hostPeer = new Peer("infrace-" + hostingId);
  const clientPeer = new Peer();

  const connections: DataConnection[] = [];

  const [connectErrorMessage, setConnectErrorMessage] = createSignal<
    string | null
  >();

  const [gameStore, updateGameStore] =
    createStore<z.infer<typeof gameStateSchema>>(defaultGameState);

  const [playerStore, updatePlayerStores] = createStore<
    z.infer<typeof playerStoreSchema>
  >({
    [myPlayerId]: { name: playerName() || "" },
  });

  const handleData = (data: unknown) => {
    // Send data to all connections
    const jsoned = JSON.parse(data as string);
  };

  hostPeer.on("connection", (conn) => {
    setIsHost(true);
    console.log("Connection established");
    setIsconnected(true);
    connections.push(conn);

    // TODO: On init, to get player up to speed

    conn.on("data", (data) => {
      connections.forEach((connection) => {
        if (connection.peer !== conn.peer) {
          const payload = {
            type: "state",
            payload: data,
          };
          connection.send(JSON.stringify(payload));
        }
      });
      handleData(data);
      console.log("Host got data");
    });
  });

  clientPeer.on("error", (e) => {
    if (e.type === "peer-unavailable") {
      setConnectErrorMessage("Invalid Game ID");
    } else {
      setConnectErrorMessage("Could not connect");
    }
  });

  const connectToHostAsClient = (code: string) => {
    if (code === hostingId) {
      setConnectErrorMessage("You cannot join your own game");
      return;
    }
    if (code === "") {
      setConnectErrorMessage("Please enter a game ID");
      return;
    }
    try {
      const conn = clientPeer.connect("infrace-" + code);
      conn.on("open", () => {
        connections.push(conn);
        setIsconnected(true);
        conn.on("data", (data) => {
          handleData(data);
        });
      });
    } catch (err) {
      setConnectErrorMessage("Could not connect");
      console.error(err);
    }

    // Try to reconnect if connection is lost
    clientPeer.on("disconnected", () => {
      console.log("Reconnecting");
      clientPeer.reconnect();
    });
  };

  const sendGameStoreData = (
    data: z.infer<typeof stateUpdateMessage>["payload"],
  ) => {
    const payload = {
      type: "state",
      payload: data,
    };
    // Send data to all connections
    connections.forEach((conn) => {
      console.log("Sending data", payload);
      conn.send(JSON.stringify(payload));
    });
  };

  const updateGameState: SetStoreFunction<z.infer<typeof gameStateSchema>> = (
    ...args: any
  ) => {
    updateGameStore(args);
    sendGameStoreData(gameStore);
  };

  return {
    isConnected,
    hostingId,
    connectToHostAsClient,
    gameStore,
    updateGameState,
    connectErrorMessage,
    isHost,
  };
};
