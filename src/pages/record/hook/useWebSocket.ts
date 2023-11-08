import { useEffect, useState } from 'react';
import { RECORDING_STATE, WS_STATE } from '../const';

interface UseWebSocket {
  getSocket: () => WebSocket;
  init: () => any;
  onClose: () => void;
}

const useWebSocket = (
  endpoint: string,
  recordingState: RECORDING_STATE,
  messageHandler: (e: MessageEvent) => any
): UseWebSocket => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const init = () => {
    const newSocket = new WebSocket(endpoint);
    newSocket.onmessage = messageHandler;
    setSocket(newSocket);

    return newSocket;
  };

  const getSocket = () => {
    if (!socket || socket.readyState === WS_STATE.CLOSING || socket.readyState === WS_STATE.CLOSED) {
      return init();
    }

    return socket;
  };

  const onClose = () => {
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
    } else if (recordingState === RECORDING_STATE.STOPPED || recordingState === RECORDING_STATE.INIT) {
      onClose();
    }

    return onClose;
  }, [recordingState, socket]);

  return {
    getSocket,
    init,
    onClose
  };
};

export default useWebSocket;
