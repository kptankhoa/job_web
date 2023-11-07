import { useEffect, useState } from 'react';

const useHandleMediaStream = () => {
  const [, setActiveStreamMap] = useState<{[id: string]: MediaStream}>({});

  const mapNewStream = (id: string, stream: MediaStream) => {
    setActiveStreamMap((oldStreams) => ({ ...oldStreams, [id]: stream }));
  };

  const stopStreamById = (stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      track?.stop();
    });
  };

  const stopAllStreamData = () => {
    setActiveStreamMap((value) => {
      Object.values(value).forEach(stopStreamById);

      return {};
    });
  };

  useEffect(() => () => stopAllStreamData(), []);

  return {
    mapNewStream,
    stopAllStreamData
  };
};

export default useHandleMediaStream;
