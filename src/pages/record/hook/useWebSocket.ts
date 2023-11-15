import { useEffect, useState } from 'react';
import { RECORDING_STATE, WS_STATE } from '../const';

interface UseWebSocket {
  getSocket: () => WebSocket;
  init: () => any;
  send: (data: object | string) => void;
  close: () => void;
}

interface Props {
  endpoint: string,
  recordingState: RECORDING_STATE,
  messageHandler: (e: MessageEvent) => any,
  onOpen?: (s: WebSocket) => void
}
const useWebSocket = ({
  endpoint,
  recordingState,
  messageHandler,
  onOpen
}: Props): UseWebSocket => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const init = () => {
    const newSocket = new WebSocket(endpoint);
    newSocket.onmessage = messageHandler;
    newSocket.onopen = () => {
      if (!onOpen) {
        return;
      }
      onOpen(newSocket);
    };

    setSocket(newSocket);

    return newSocket;
  };

  const getSocket = () => {
    if (!socket || socket.readyState === WS_STATE.CLOSING || socket.readyState === WS_STATE.CLOSED) {
      return init();
    }

    return socket;
  };

  const send = (body: object | string) => {
    if (socket?.readyState === WS_STATE.OPEN) {
      socket.send(JSON.stringify(body));
    }
  };

  const close = () => {
    if (!socket) {
      return;
    }
    socket.close();
    setSocket(null);
  };

  useEffect(() => {
    if (recordingState === RECORDING_STATE.RECORDING
      && (!socket || socket.readyState === WS_STATE.CLOSING || socket.readyState === WS_STATE.CLOSED)) {
      init();
    } else if (recordingState === RECORDING_STATE.INIT) {
      close();
    }
  }, [recordingState, socket]);

  useEffect(() => () => {
    if (socket) {
      socket.close();
    }
  }, [socket]);

  return {
    getSocket,
    init,
    send,
    close
  };
};

export default useWebSocket;
