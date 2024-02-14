import { customAlphabet } from "nanoid";
import Peer, { DataConnection } from "peerjs";
import { createSignal } from "solid-js";
import { z } from "zod";
import {
  defaultGameState,
  gameStateSchema,
  stateUpdateMessageSchema,
} from "./messageAndStateSchema";
import { createStore } from "solid-js/store";

const customAlph = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

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

  const handleData = (
    senderId: string,
    data: z.infer<typeof gameStateSchema>,
  ) => {
    // Send data to all connections
    connections.forEach((conn) => {
      console.log("Sending data", data, senderId, conn.peer);
      if (conn.peer !== senderId) {
        const payload = {
          type: "state",
          payload: data,
        };
        conn.send(JSON.stringify(payload));
      }
    });

    console.log("Received data", data);

    updateGameStore(data);
  };

  hostPeer.on("connection", (conn) => {
    setIsHost(true);
    console.log("Connection established");
    setIsconnected(true);
    connections.push(conn);

    sendData(gameStore);

    conn.on("data", (data) => {
      console.log("Host got data");
      const jsoned = JSON.parse(data as string);
      const result = stateUpdateMessageSchema.safeParse(jsoned);
      if (!result.success) {
        console.error("Invalid data received", result.error);
        return;
      }
      handleData(conn.peer, result.data.payload);
    });

    conn.on("open", () => {
      console.log("open from host");
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
    console.log("connecting to host");
    try {
      const conn = clientPeer.connect("infrace-" + code);
      conn.on("open", () => {
        connections.push(conn);
        setIsconnected(true);
        conn.on("data", (data) => {
          const jsoned = JSON.parse(data as string);
          const result = stateUpdateMessageSchema.safeParse(jsoned);
          if (!result.success) {
            console.error("Invalid data received", result.error);
            return;
          }
          handleData(conn.peer, result.data.payload);
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

  const sendData = (
    data: z.infer<typeof stateUpdateMessageSchema>["payload"],
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

  const updateGameState = (data: z.infer<typeof gameStateSchema>) => {
    updateGameStore(data);
    sendData(data);
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
